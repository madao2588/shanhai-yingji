const fs = require("node:fs/promises");
const http = require("node:http");
const path = require("node:path");
const { loadConfig } = require("./config.cjs");
const { JsonDatabase } = require("./database.cjs");
const { createMediaStore } = require("./media-store.cjs");
const { PostgresDatabase } = require("./postgres-database.cjs");
const { createRateLimiter, securityHeaders } = require("./security.cjs");
const { createToken, hashPassword, publicUser, verifyPassword } = require("./auth.cjs");
const {
  validateAuthInput,
  validateCommentInput,
  validateLoginInput,
  validateMemoryInput,
  validateModerationInput,
  validateProfileInput,
  validateReportInput,
  validateUploadInput,
} = require("./validation.cjs");

const staticFiles = new Set([
  "index.html",
  "styles.css",
  "manifest.webmanifest",
  "service-worker.js",
  "assets/app-icon.svg",
  "assets/avatar-lin-che.svg",
  "assets/photo-kyoto-temple.svg",
  "assets/photo-kyoto-street.svg",
  "assets/photo-iceland-mountain.svg",
  "assets/photo-iceland-coast.svg",
  "assets/photo-paris.svg",
  "assets/photo-desert-city.svg",
  "assets/photo-alpine.svg",
  "assets/photo-ocean.svg",
  "assets/bg-record-ink.png",
  "assets/bg-community-ink.png",
  "assets/bg-create-ink.png",
  "assets/bg-messages-ink.png",
  "assets/bg-profile-ink.png",
  "src/api-client.js",
  "src/fullstack-panel.js",
  "src/main.js",
  "src/pwa-register.js",
  "src/data/seed-destinations.js",
  "src/data/seed-memories.js",
  "src/domain/memory.js",
  "src/storage/archive-export.js",
  "src/storage/local-store.js",
]);

function sendJson(response, status, payload, headers = {}) {
  response.writeHead(status, {
    ...securityHeaders(),
    ...(response.shanhaiCorsHeaders || {}),
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
    ...headers,
  });
  response.end(JSON.stringify(payload));
}

function sendNoContent(response) {
  response.writeHead(204, {
    ...securityHeaders(),
    ...(response.shanhaiCorsHeaders || {}),
  });
  response.end();
}

function readBody(request, limitBytes) {
  return new Promise((resolve, reject) => {
    let body = "";
    request.on("data", (chunk) => {
      body += chunk;
      if (Buffer.byteLength(body) > limitBytes) {
        reject(Object.assign(new Error("Payload too large"), { status: 413 }));
        request.destroy();
      }
    });
    request.on("end", () => {
      if (!body) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(body));
      } catch {
        reject(Object.assign(new Error("Invalid JSON"), { status: 400 }));
      }
    });
    request.on("error", reject);
  });
}

function getToken(request) {
  const value = request.headers.authorization || "";
  const match = value.match(/^Bearer\s+(.+)$/i);
  return match ? match[1] : "";
}

async function getCurrentUser(request, db) {
  const token = getToken(request);
  if (!token) {
    return null;
  }

  const session = await db.findSession(token);
  if (!session) {
    return null;
  }

  return db.findUserById(session.userId);
}

function withAuthor(memory, user) {
  return {
    ...memory,
    author: user ? { id: user.id, name: user.name, username: user.username } : null,
  };
}

function sanitizeMemoryForPublic(memory) {
  return {
    id: memory.id,
    title: memory.title,
    body: memory.body,
    locationLabel: memory.locationLabel,
    country: memory.country,
    city: memory.city,
    destinationId: memory.destinationId,
    season: memory.season,
    budget: memory.budget,
    audience: memory.audience,
    route: memory.route || [],
    visited: Boolean(memory.visited),
    occurredAt: memory.occurredAt,
    tags: memory.tags,
    status: memory.status,
    visibility: memory.status,
    photos: memory.photos,
    likeCount: memory.likeCount || 0,
    bookmarkCount: memory.bookmarkCount || 0,
    commentCount: memory.commentCount || 0,
    viewCount: memory.viewCount || 0,
    likedByViewer: Boolean(memory.likedByViewer),
    bookmarkedByViewer: Boolean(memory.bookmarkedByViewer),
    createdAt: memory.createdAt,
    updatedAt: memory.updatedAt,
    publishedAt: memory.publishedAt,
    author: memory.author,
  };
}

async function enrichMemory(db, memory, viewerId = "") {
  const [author, counts, viewerState] = await Promise.all([
    db.findUserById(memory.userId),
    db.getMemoryCounts(memory.id),
    db.getViewerState(memory.id, viewerId),
  ]);
  return sanitizeMemoryForPublic(withAuthor({ ...memory, ...counts, ...viewerState }, author));
}

async function enrichComment(db, comment) {
  return {
    ...comment,
    author: publicUser(await db.findUserById(comment.userId)),
  };
}

function isAdmin(user) {
  return user && user.role === "admin";
}

function isApiPath(pathname) {
  return pathname === "/api" || pathname.startsWith("/api/");
}

function applyOriginPolicy(request, response, config) {
  const origin = request.headers.origin || "";
  if (!config.allowedOrigin || !origin) {
    return true;
  }

  if (origin !== config.allowedOrigin) {
    sendJson(response, 403, { error: "origin not allowed" });
    return false;
  }

  response.shanhaiCorsHeaders = {
    "access-control-allow-origin": config.allowedOrigin,
    "access-control-allow-headers": "content-type, authorization",
    "access-control-allow-methods": "GET,POST,PATCH,DELETE,OPTIONS",
    vary: "Origin",
  };
  return true;
}

function createDatabase(config, options = {}) {
  if (options.db) {
    return options.db;
  }
  if (config.databaseAdapter === "postgres") {
    return new PostgresDatabase({
      connectionString: config.databaseUrl,
      pool: options.pgPool,
      ssl: config.databaseSsl,
    });
  }
  return new JsonDatabase({ dataDir: config.dataDir });
}

function isAllowedStaticPath(relative) {
  const normalized = relative.replace(/\\/g, "/");
  if (normalized.split("/").some((part) => part.startsWith("."))) {
    return false;
  }

  return staticFiles.has(normalized);
}

async function serveStatic(response, pathname, { dataDir, publicDir }) {
  const decoded = decodeURIComponent(pathname);
  if (decoded.startsWith("/uploads/")) {
    const uploadName = path.basename(decoded);
    await serveFile(response, path.join(dataDir, "uploads", uploadName));
    return;
  }

  const relative = decoded === "/" ? "index.html" : decoded.replace(/^\/+/, "");
  if (!isAllowedStaticPath(relative)) {
    response.writeHead(404, securityHeaders({ "content-type": "text/plain; charset=utf-8" }));
    response.end("Not found");
    return;
  }

  const target = path.resolve(publicDir, relative);
  const root = path.resolve(publicDir);
  const relativePath = path.relative(root, target);
  if (relativePath.startsWith("..") || path.isAbsolute(relativePath)) {
    response.writeHead(403, securityHeaders({ "content-type": "text/plain; charset=utf-8" }));
    response.end("Forbidden");
    return;
  }

  await serveFile(response, target);
}

async function serveFile(response, filePath) {
  try {
    const stat = await fs.stat(filePath);
    const target = stat.isDirectory() ? path.join(filePath, "index.html") : filePath;
    const content = await fs.readFile(target);
    const ext = path.extname(target).toLowerCase();
    const contentType =
      {
        ".html": "text/html; charset=utf-8",
        ".css": "text/css; charset=utf-8",
        ".js": "text/javascript; charset=utf-8",
        ".json": "application/json; charset=utf-8",
        ".svg": "image/svg+xml",
        ".png": "image/png",
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
      }[ext] || "application/octet-stream";
    const shouldRevalidate = [".html", ".css", ".js"].includes(ext) || path.basename(target) === "service-worker.js";

    response.writeHead(200, {
      ...securityHeaders(),
      "content-type": contentType,
      "cache-control": shouldRevalidate ? "no-cache" : "public, max-age=3600",
    });
    response.end(content);
  } catch {
    response.writeHead(404, securityHeaders({ "content-type": "text/plain; charset=utf-8" }));
    response.end("Not found");
  }
}

function createApp(options = {}) {
  const config = loadConfig(options);
  const publicDir = config.publicDir;
  const dataDir = config.dataDir;
  const db = createDatabase(config, options);
  const mediaStore = createMediaStore(config, options);
  const checkRateLimit = createRateLimiter(config.rateLimit);

  const server = http.createServer(async (request, response) => {
    const url = new URL(request.url, "http://127.0.0.1");
    const pathname = url.pathname;

    try {
      if (!isApiPath(pathname)) {
        await serveStatic(response, pathname, { dataDir, publicDir });
        return;
      }

      if (!applyOriginPolicy(request, response, config)) {
        return;
      }

      const rateLimit = await checkRateLimit(request);
      if (rateLimit.limited) {
        sendJson(response, 429, { error: "too many requests" }, { "retry-after": String(Math.ceil((rateLimit.resetAt - Date.now()) / 1000)) });
        return;
      }

      if (request.method === "OPTIONS") {
        sendNoContent(response);
        return;
      }

      if (request.method === "GET" && pathname === "/api/health") {
        await db.ensureLoaded();
        sendJson(response, 200, {
          status: "ok",
          service: "shanhai-yingji",
          database: config.databaseAdapter,
          mediaStore: config.mediaStore,
          uploads: await mediaStore.health(),
          timestamp: new Date().toISOString(),
        });
        return;
      }

      if (request.method === "POST" && pathname === "/api/auth/register") {
        const body = validateAuthInput(await readBody(request, config.maxJsonBytes));
        if (await db.findUserByEmail(body.email)) {
          sendJson(response, 409, { error: "email already registered" });
          return;
        }
        const user = await db.createUser({
          name: body.name,
          email: body.email,
          passwordHash: hashPassword(body.password),
          role: config.adminEmails.includes(body.email) ? "admin" : "member",
        });
        const token = createToken();
        await db.createSession(user.id, token);
        sendJson(response, 201, { token, user: publicUser(user) });
        return;
      }

      if (request.method === "POST" && pathname === "/api/auth/login") {
        const body = validateLoginInput(await readBody(request, config.maxJsonBytes));
        const user = await db.findUserByEmail(body.email);
        if (!user || !verifyPassword(body.password, user.passwordHash)) {
          sendJson(response, 401, { error: "invalid credentials" });
          return;
        }
        const token = createToken();
        await db.createSession(user.id, token);
        sendJson(response, 200, { token, user: publicUser(user) });
        return;
      }

      if (request.method === "POST" && pathname === "/api/auth/logout") {
        await db.deleteSession(getToken(request));
        sendNoContent(response);
        return;
      }

      if (request.method === "GET" && pathname === "/api/public/memories") {
        const memories = await db.listPublicMemories();
        const withAuthors = [];
        for (const memory of memories) {
          withAuthors.push(await enrichMemory(db, memory));
        }
        sendJson(response, 200, { memories: withAuthors });
        return;
      }

      if (request.method === "GET" && pathname === "/api/discover/memories") {
        const viewer = await getCurrentUser(request, db);
        const memories = await db.discoverMemories({
          q: url.searchParams.get("q"),
          tag: url.searchParams.get("tag"),
          city: url.searchParams.get("city"),
          country: url.searchParams.get("country"),
          destinationId: url.searchParams.get("destinationId"),
          sort: url.searchParams.get("sort"),
        });
        const payload = [];
        for (const memory of memories) {
          payload.push(await enrichMemory(db, memory, viewer?.id));
        }
        sendJson(response, 200, { memories: payload });
        return;
      }

      if (request.method === "GET" && pathname === "/api/tags") {
        sendJson(response, 200, { tags: await db.aggregateTags() });
        return;
      }

      if (request.method === "GET" && pathname === "/api/destinations") {
        sendJson(response, 200, { destinations: await db.aggregateDestinations() });
        return;
      }

      const publicMemoryMatch = pathname.match(/^\/api\/public\/memories\/([^/]+)$/);
      if (request.method === "GET" && publicMemoryMatch) {
        const memory = await db.findPublicReadableMemory(publicMemoryMatch[1]);
        if (!memory) {
          sendJson(response, 404, { error: "memory not found" });
          return;
        }
        sendJson(response, 200, { memory: await enrichMemory(db, memory) });
        return;
      }

      const publicCommentsMatch = pathname.match(/^\/api\/memories\/([^/]+)\/comments$/);
      if (request.method === "GET" && publicCommentsMatch) {
        const memory = await db.findPublicReadableMemory(publicCommentsMatch[1]);
        if (!memory) {
          sendJson(response, 404, { error: "memory not found" });
          return;
        }
        const comments = [];
        for (const comment of await db.listComments(memory.id)) {
          comments.push(await enrichComment(db, comment));
        }
        sendJson(response, 200, { comments });
        return;
      }

      const profileMatch = pathname.match(/^\/api\/profile\/([^/]+)$/);
      if (request.method === "GET" && profileMatch) {
        const user = await db.findUserByUsername(profileMatch[1]);
        if (!user) {
          sendJson(response, 404, { error: "profile not found" });
          return;
        }
        const publicMemories = (await db.listPublicMemories()).filter((memory) => memory.userId === user.id);
        const memories = [];
        for (const memory of publicMemories) {
          memories.push(await enrichMemory(db, memory));
        }
        sendJson(response, 200, { user: publicUser(user), memories });
        return;
      }

      const user = await getCurrentUser(request, db);
      if (!user) {
        sendJson(response, 401, { error: "authentication required" });
        return;
      }

      if (request.method === "GET" && pathname === "/api/me") {
        sendJson(response, 200, { user: publicUser(user) });
        return;
      }

      if (request.method === "PATCH" && pathname === "/api/me") {
        const updated = await db.updateUser(user.id, validateProfileInput(await readBody(request, config.maxJsonBytes)));
        sendJson(response, 200, { user: publicUser(updated) });
        return;
      }

      if (request.method === "DELETE" && pathname === "/api/me") {
        await db.deleteUser(user.id);
        sendNoContent(response);
        return;
      }

      if (request.method === "GET" && pathname === "/api/memories") {
        sendJson(response, 200, { memories: await db.listMemories(user.id) });
        return;
      }

      if (request.method === "POST" && pathname === "/api/memories") {
        const memory = await db.createMemory(user.id, validateMemoryInput(await readBody(request, config.maxJsonBytes)));
        sendJson(response, 201, { memory });
        return;
      }

      if (request.method === "GET" && pathname === "/api/notifications") {
        sendJson(response, 200, { notifications: await db.listNotifications(user.id) });
        return;
      }

      const notificationReadMatch = pathname.match(/^\/api\/notifications\/([^/]+)\/read$/);
      if (request.method === "PATCH" && notificationReadMatch) {
        const notification = await db.markNotificationRead(user.id, notificationReadMatch[1]);
        if (!notification) {
          sendJson(response, 404, { error: "notification not found" });
          return;
        }
        sendJson(response, 200, { notification });
        return;
      }

      if (request.method === "GET" && pathname === "/api/creator/stats") {
        sendJson(response, 200, { stats: await db.creatorStats(user.id) });
        return;
      }

      if (request.method === "POST" && pathname === "/api/reports") {
        const report = await db.createReport(user.id, validateReportInput(await readBody(request, config.maxJsonBytes)));
        sendJson(response, 201, { report });
        return;
      }

      if (request.method === "GET" && pathname === "/api/admin/reports") {
        if (!isAdmin(user)) {
          sendJson(response, 403, { error: "admin access required" });
          return;
        }
        sendJson(response, 200, { reports: await db.listReports() });
        return;
      }

      if (request.method === "GET" && pathname === "/api/admin/metrics") {
        if (!isAdmin(user)) {
          sendJson(response, 403, { error: "admin access required" });
          return;
        }
        sendJson(response, 200, { metrics: await db.adminMetrics() });
        return;
      }

      if (request.method === "GET" && pathname === "/api/admin/backup") {
        if (!isAdmin(user)) {
          sendJson(response, 403, { error: "admin access required" });
          return;
        }
        sendJson(response, 200, { backup: await db.exportFullBackup() });
        return;
      }

      const adminReportMatch = pathname.match(/^\/api\/admin\/reports\/([^/]+)$/);
      if (request.method === "PATCH" && adminReportMatch) {
        if (!isAdmin(user)) {
          sendJson(response, 403, { error: "admin access required" });
          return;
        }
        const report = await db.moderateReport(adminReportMatch[1], user.id, validateModerationInput(await readBody(request, config.maxJsonBytes)));
        if (!report) {
          sendJson(response, 404, { error: "report not found" });
          return;
        }
        sendJson(response, 200, { report });
        return;
      }

      const likeMatch = pathname.match(/^\/api\/memories\/([^/]+)\/like$/);
      if (request.method === "POST" && likeMatch) {
        const result = await db.toggleLike(likeMatch[1], user.id);
        if (!result) {
          sendJson(response, 404, { error: "memory not found" });
          return;
        }
        sendJson(response, 200, result);
        return;
      }

      const bookmarkMatch = pathname.match(/^\/api\/memories\/([^/]+)\/bookmark$/);
      if (request.method === "POST" && bookmarkMatch) {
        const result = await db.toggleBookmark(bookmarkMatch[1], user.id);
        if (!result) {
          sendJson(response, 404, { error: "memory not found" });
          return;
        }
        sendJson(response, 200, result);
        return;
      }

      const commentMatch = pathname.match(/^\/api\/memories\/([^/]+)\/comments$/);
      if (request.method === "POST" && commentMatch) {
        const comment = await db.addComment(commentMatch[1], user.id, validateCommentInput(await readBody(request, config.maxJsonBytes)));
        if (!comment) {
          sendJson(response, 404, { error: "memory not found" });
          return;
        }
        sendJson(response, 201, { comment: await enrichComment(db, comment) });
        return;
      }

      const followProfileMatch = pathname.match(/^\/api\/profile\/([^/]+)\/follow$/);
      if (request.method === "POST" && followProfileMatch) {
        const target = await db.findUserByUsername(followProfileMatch[1]);
        if (!target) {
          sendJson(response, 404, { error: "profile not found" });
          return;
        }
        const result = await db.toggleFollow(target.id, user.id);
        if (!result) {
          sendJson(response, 400, { error: "cannot follow this profile" });
          return;
        }
        sendJson(response, 200, result);
        return;
      }

      const memoryMatch = pathname.match(/^\/api\/memories\/([^/]+)$/);
      if (memoryMatch) {
        const memoryId = memoryMatch[1];
        if (request.method === "GET") {
          const memory = await db.findMemory(memoryId);
          if (!memory || memory.userId !== user.id) {
            sendJson(response, 404, { error: "memory not found" });
            return;
          }
          sendJson(response, 200, { memory });
          return;
        }
        if (request.method === "PATCH") {
          const memory = await db.updateMemory(memoryId, user.id, validateMemoryInput(await readBody(request, config.maxJsonBytes), { partial: true }));
          if (!memory) {
            sendJson(response, 404, { error: "memory not found" });
            return;
          }
          sendJson(response, 200, { memory });
          return;
        }
        if (request.method === "DELETE") {
          if (!(await db.deleteMemory(memoryId, user.id))) {
            sendJson(response, 404, { error: "memory not found" });
            return;
          }
          sendNoContent(response);
          return;
        }
      }

      const photoMatch = pathname.match(/^\/api\/memories\/([^/]+)\/photos$/);
      if (request.method === "POST" && photoMatch) {
        const upload = await mediaStore.save(validateUploadInput(await readBody(request, config.maxJsonBytes), config.maxUploadBytes));
        if (!upload) {
          sendJson(response, 400, { error: "valid dataUrl is required" });
          return;
        }
        const photo = await db.addPhoto(photoMatch[1], user.id, upload);
        if (!photo) {
          sendJson(response, 404, { error: "memory not found" });
          return;
        }
        sendJson(response, 201, { photo });
        return;
      }

      const photoDeleteMatch = pathname.match(/^\/api\/memories\/([^/]+)\/photos\/([^/]+)$/);
      if (request.method === "DELETE" && photoDeleteMatch) {
        const memoryBeforeDelete = await db.findMemory(photoDeleteMatch[1]);
        const photoBeforeDelete =
          memoryBeforeDelete?.userId === user.id ? (memoryBeforeDelete.photos || []).find((photo) => photo.id === photoDeleteMatch[2]) : null;
        const deleted = await db.deletePhoto(photoDeleteMatch[1], photoDeleteMatch[2], user.id);
        if (deleted === null) {
          sendJson(response, 404, { error: "memory not found" });
          return;
        }
        if (!deleted) {
          sendJson(response, 404, { error: "photo not found" });
          return;
        }
        if (photoBeforeDelete) {
          await mediaStore.delete(photoBeforeDelete);
        }
        sendNoContent(response);
        return;
      }

      if (request.method === "GET" && pathname === "/api/export") {
        sendJson(response, 200, { archive: await db.exportArchive(user.id) });
        return;
      }

      if (request.method === "POST" && pathname === "/api/import") {
        sendJson(response, 200, await db.importArchive(user.id, await readBody(request, config.maxJsonBytes)));
        return;
      }

      sendJson(response, 404, { error: "route not found" });
    } catch (error) {
      sendJson(response, error.status || 500, { error: error.message || "server error" });
    }
  });

  server.shanhai = { db, dataDir, mediaStore, publicDir, config };
  return server;
}

module.exports = {
  createDatabase,
  createApp,
};
