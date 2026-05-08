import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { createApp } = require("../server/app.cjs");
const { loadConfig } = require("../server/config.cjs");

const projectRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const dataDir = await mkdtemp(join(tmpdir(), "shanhai-api-"));
const server = createApp({ dataDir, publicDir: projectRoot });

function listen(app) {
  return new Promise((resolveListen) => {
    app.listen(0, "127.0.0.1", () => resolveListen(app.address().port));
  });
}

async function request(port, method, path, body, token, extraHeaders = {}) {
  const response = await fetch(`http://127.0.0.1:${port}${path}`, {
    method,
    headers: {
      "content-type": "application/json",
      ...(token ? { authorization: `Bearer ${token}` } : {}),
      ...extraHeaders,
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const text = await response.text();
  const payload = text ? JSON.parse(text) : null;
  return { response, payload };
}

const port = await listen(server);

try {
  const health = await request(port, "GET", "/api/health");
  assert.equal(health.response.status, 200, "health check should be public");
  assert.equal(health.payload.status, "ok", "health check should report ok");
  assert.equal(health.payload.checks.database.status, "ok", "health check should probe the database");
  assert.equal(health.payload.checks.media.status, "ok", "health check should probe the media store");
  assert.equal(health.response.headers.get("x-content-type-options"), "nosniff", "responses should include security headers");
  assert.equal(health.response.headers.get("referrer-policy"), "no-referrer", "responses should include a referrer policy");

  const configuredDataDir = await mkdtemp(join(tmpdir(), "shanhai-configured-api-"));
  const configuredServer = createApp(loadConfig({ dataDir: configuredDataDir, publicDir: projectRoot }));
  const configuredPort = await listen(configuredServer);
  try {
    const configuredHealth = await request(configuredPort, "GET", "/api/health");
    assert.equal(configuredHealth.response.status, 200, "health check should work when createApp receives a loaded config");
    assert.equal(configuredHealth.payload.uploads, "local", "loaded local config should create a local media store");
    assert.equal(configuredHealth.payload.checks.media.store, "local", "loaded local config should report local media health");
  } finally {
    await new Promise((resolveClose) => configuredServer.close(resolveClose));
    await rm(configuredDataDir, { recursive: true, force: true });
  }

  const failingHealthServer = createApp({
    dataDir: await mkdtemp(join(tmpdir(), "shanhai-failing-health-")),
    publicDir: projectRoot,
    mediaStore: {
      async health() {
        throw new Error("r2 secret endpoint leaked");
      },
      async save() {
        return null;
      },
      async delete() {},
    },
  });
  const failingHealthPort = await listen(failingHealthServer);
  try {
    const failingHealth = await request(failingHealthPort, "GET", "/api/health");
    assert.equal(failingHealth.response.status, 503, "health check should fail explicitly when a dependency probe fails");
    assert.equal(failingHealth.payload.status, "degraded", "failed dependency probes should report degraded status");
    assert.equal(failingHealth.payload.checks.media.status, "error", "failed media probes should be named");
    assert.doesNotMatch(JSON.stringify(failingHealth.payload), /secret endpoint/, "public health should not leak dependency error details");
  } finally {
    await new Promise((resolveClose) => failingHealthServer.close(resolveClose));
    await rm(failingHealthServer.shanhai.dataDir, { recursive: true, force: true });
  }

  const failingR2DataDir = await mkdtemp(join(tmpdir(), "shanhai-failing-r2-health-"));
  const failingR2Server = createApp({
    dataDir: failingR2DataDir,
    publicDir: projectRoot,
    mediaStore: "r2",
    r2: {
      endpoint: "https://account.r2.cloudflarestorage.com",
      accessKeyId: "key",
      secretAccessKey: "secret",
      bucket: "shanhai",
      publicBaseUrl: "https://media.example.com",
    },
    r2Client: {
      async send() {
        throw new Error("head bucket denied");
      },
    },
  });
  const failingR2Port = await listen(failingR2Server);
  try {
    const failingR2Health = await request(failingR2Port, "GET", "/api/health");
    assert.equal(failingR2Health.response.status, 503, "R2 bucket probe failures should degrade health");
    assert.equal(failingR2Health.payload.checks.media.store, "r2");
    assert.equal(failingR2Health.payload.checks.media.status, "error");
  } finally {
    await new Promise((resolveClose) => failingR2Server.close(resolveClose));
    await rm(failingR2DataDir, { recursive: true, force: true });
  }

  const packageProbe = await fetch(`http://127.0.0.1:${port}/package.json`);
  assert.equal(packageProbe.status, 404, "server should not expose package metadata");

  const serverSourceProbe = await fetch(`http://127.0.0.1:${port}/server/app.cjs`);
  assert.equal(serverSourceProbe.status, 404, "server should not expose backend source files");

  const dataProbe = await fetch(`http://127.0.0.1:${port}/.data/shanhai-db.json`);
  assert.equal(dataProbe.status, 404, "server should not expose data files");

  const invalidEmail = await request(port, "POST", "/api/auth/register", {
    name: "坏邮箱",
    email: "not-an-email",
    password: "correct horse battery",
  });
  assert.equal(invalidEmail.response.status, 400, "invalid registration email should be rejected");

  const weakPassword = await request(port, "POST", "/api/auth/register", {
    name: "弱密码",
    email: "weak@example.com",
    password: "123",
  });
  assert.equal(weakPassword.response.status, 400, "weak registration password should be rejected");

  const register = await request(port, "POST", "/api/auth/register", {
    name: "林山海",
    email: "lin@example.com",
    password: "correct horse battery",
  });
  assert.equal(register.response.status, 201, "register should create an account");
  assert.match(register.payload.token, /^[a-f0-9]{48,}$/, "register should return an auth token");
  assert.equal(register.payload.user.email, "lin@example.com", "register should return the user profile");

  const duplicate = await request(port, "POST", "/api/auth/register", {
    name: "重复",
    email: "lin@example.com",
    password: "correct horse battery",
  });
  assert.equal(duplicate.response.status, 409, "duplicate registration should be rejected");

  const login = await request(port, "POST", "/api/auth/login", {
    email: "lin@example.com",
    password: "correct horse battery",
  });
  assert.equal(login.response.status, 200, "login should accept valid credentials");
  const token = login.payload.token;

  const unauthorized = await request(port, "GET", "/api/me");
  assert.equal(unauthorized.response.status, 401, "protected routes should reject missing tokens");

  const me = await request(port, "GET", "/api/me", undefined, token);
  assert.equal(me.response.status, 200, "authenticated users should read their profile");
  assert.equal(me.payload.user.name, "林山海", "profile should include display name");

  const created = await request(
    port,
    "POST",
    "/api/memories",
    {
      title: "京都上线测试",
      body: "第一篇服务端旅行日志",
      locationLabel: "日本京都",
      country: "日本",
      city: "京都",
      tags: ["上线", "京都"],
      occurredAt: "2026-04-12",
    },
    token,
  );
  assert.equal(created.response.status, 201, "authenticated users should create memories");
  assert.equal(created.payload.memory.status, "private", "new memories should default to private");
  const memoryId = created.payload.memory.id;

  const invalidMemory = await request(
    port,
    "POST",
    "/api/memories",
    {
      title: "x".repeat(121),
      body: "invalid",
      status: "friends-only",
    },
    token,
  );
  assert.equal(invalidMemory.response.status, 400, "invalid memory input should be rejected");

  const privatePublicList = await request(port, "GET", "/api/public/memories");
  assert.equal(privatePublicList.response.status, 200, "public list should be readable without auth");
  assert.equal(privatePublicList.payload.memories.length, 0, "private memories should not appear publicly");

  const updated = await request(
    port,
    "PATCH",
    `/api/memories/${memoryId}`,
    {
      title: "京都上线测试已发布",
      status: "public",
    },
    token,
  );
  assert.equal(updated.response.status, 200, "owners should update their memories");
  assert.equal(updated.payload.memory.status, "public", "owners should be able to publish memories");
  assert.ok(updated.payload.memory.publishedAt, "published memories should receive publishedAt");

  const publicList = await request(port, "GET", "/api/public/memories");
  assert.equal(publicList.payload.memories.length, 1, "public memories should appear publicly");
  assert.equal(publicList.payload.memories[0].title, "京都上线测试已发布", "public list should include updated title");

  const uploaded = await request(
    port,
    "POST",
    `/api/memories/${memoryId}/photos`,
    {
      fileName: "kyoto.png",
      mimeType: "image/png",
      dataUrl: "data:image/png;base64,dGlueS1pbWFnZQ==",
      alt: "京都测试图",
    },
    token,
  );
  assert.equal(uploaded.response.status, 201, "owners should upload memory photos");
  assert.match(uploaded.payload.photo.url, /^\/uploads\/.+\.png$/, "uploaded photos should receive a safe served media URL");
  const uploadedPhotoPath = join(dataDir, uploaded.payload.photo.url.replace(/^\//, ""));
  assert.equal(existsSync(uploadedPhotoPath), true, "uploaded photo file should exist on disk before deletion");

  const invalidUpload = await request(
    port,
    "POST",
    `/api/memories/${memoryId}/photos`,
    {
      fileName: "bad.txt",
      mimeType: "text/plain",
      dataUrl: "data:text/plain;base64,Zm9v",
    },
    token,
  );
  assert.equal(invalidUpload.response.status, 400, "non-image uploads should be rejected");

  const spoofedUpload = await request(
    port,
    "POST",
    `/api/memories/${memoryId}/photos`,
    {
      fileName: "spoofed.png",
      mimeType: "image/png",
      dataUrl: "data:text/plain;base64,Zm9v",
    },
    token,
  );
  assert.equal(spoofedUpload.response.status, 400, "upload mimeType should match the data URL media type");

  const exported = await request(port, "GET", "/api/export", undefined, token);
  assert.equal(exported.response.status, 200, "users should export their archive");
  assert.equal(exported.payload.archive.memories.length, 1, "export should include owned memories");
  assert.equal(exported.payload.archive.memories[0].photos.length, 1, "export should include photo metadata");

  const secondRegister = await request(port, "POST", "/api/auth/register", {
    name: "备份用户",
    email: "backup@example.com",
    password: "correct horse battery",
  });

  const nonOwnerDelete = await request(port, "DELETE", `/api/memories/${memoryId}/photos/${uploaded.payload.photo.id}`, undefined, secondRegister.payload.token);
  assert.equal(nonOwnerDelete.response.status, 404, "non-owners should not delete another user's photos");
  assert.equal(existsSync(uploadedPhotoPath), true, "non-owner photo delete attempts should not remove files");

  const importResult = await request(port, "POST", "/api/import", exported.payload.archive, secondRegister.payload.token);
  assert.equal(importResult.response.status, 200, "users should import archive backups");
  assert.equal(importResult.payload.imported, 1, "import should restore one memory into the second account");

  const deletedPhoto = await request(port, "DELETE", `/api/memories/${memoryId}/photos/${uploaded.payload.photo.id}`, undefined, token);
  assert.equal(deletedPhoto.response.status, 204, "owners should delete uploaded photos");
  assert.equal(existsSync(uploadedPhotoPath), false, "deleted photo files should be removed from disk");

  const deleted = await request(port, "DELETE", `/api/memories/${memoryId}`, undefined, token);
  assert.equal(deleted.response.status, 204, "owners should delete their memories");

  const afterDelete = await request(port, "GET", "/api/memories", undefined, token);
  assert.equal(afterDelete.payload.memories.length, 0, "deleted memories should disappear from owner archive");
} finally {
  await new Promise((resolveClose) => server.close(resolveClose));
  await rm(dataDir, { recursive: true, force: true });
}

const originDataDir = await mkdtemp(join(tmpdir(), "shanhai-origin-"));
const originServer = createApp({
  dataDir: originDataDir,
  publicDir: projectRoot,
  allowedOrigin: "https://app.example.com",
});
const originPort = await listen(originServer);

try {
  const allowed = await request(originPort, "GET", "/api/health", undefined, undefined, { origin: "https://app.example.com" });
  assert.equal(allowed.response.status, 200, "configured origin should be allowed");
  assert.equal(allowed.response.headers.get("access-control-allow-origin"), "https://app.example.com", "allowed origin should receive CORS headers");

  const rejected = await request(originPort, "GET", "/api/health", undefined, undefined, { origin: "https://evil.example.com" });
  assert.equal(rejected.response.status, 403, "unexpected origins should be rejected");
} finally {
  await new Promise((resolveClose) => originServer.close(resolveClose));
  await rm(originDataDir, { recursive: true, force: true });
}

const failingMediaDataDir = await mkdtemp(join(tmpdir(), "shanhai-failing-media-"));
const failingMediaServer = createApp({
  dataDir: failingMediaDataDir,
  publicDir: projectRoot,
  mediaStore: {
    async health() {
      return "failing-test";
    },
    async save() {
      const error = new Error("media store unavailable");
      error.status = 503;
      throw error;
    },
    async delete() {},
  },
});
const failingMediaPort = await listen(failingMediaServer);

try {
  const failingUser = await request(failingMediaPort, "POST", "/api/auth/register", {
    name: "Media Failure",
    email: "media-failure@example.com",
    password: "correct horse battery",
  });
  const failingMemory = await request(
    failingMediaPort,
    "POST",
    "/api/memories",
    { title: "Upload rollback test", body: "Photo metadata should not be written when media storage fails." },
    failingUser.payload.token,
  );
  const failedUpload = await request(
    failingMediaPort,
    "POST",
    `/api/memories/${failingMemory.payload.memory.id}/photos`,
    { mimeType: "image/png", dataUrl: "data:image/png;base64,ZmFrZQ==" },
    failingUser.payload.token,
  );
  assert.equal(failedUpload.response.status, 503, "media store failures should be explicit");
  const afterFailedUpload = await request(failingMediaPort, "GET", `/api/memories/${failingMemory.payload.memory.id}`, undefined, failingUser.payload.token);
  assert.equal(afterFailedUpload.payload.memory.photos.length, 0, "failed media writes should not create photo metadata");
} finally {
  await new Promise((resolveClose) => failingMediaServer.close(resolveClose));
  await rm(failingMediaDataDir, { recursive: true, force: true });
}

const limitedDataDir = await mkdtemp(join(tmpdir(), "shanhai-rate-limit-"));
const limitedServer = createApp({
  dataDir: limitedDataDir,
  publicDir: projectRoot,
  rateLimit: { max: 2, windowMs: 60000 },
});
const limitedPort = await listen(limitedServer);

try {
  await request(limitedPort, "GET", "/api/health");
  await request(limitedPort, "GET", "/api/health");
  const limited = await request(limitedPort, "GET", "/api/health");
  assert.equal(limited.response.status, 429, "rate limit should reject excessive requests");
} finally {
  await new Promise((resolveClose) => limitedServer.close(resolveClose));
  await rm(limitedDataDir, { recursive: true, force: true });
}
