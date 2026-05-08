import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { createApp } = require("../server/app.cjs");

const projectRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const dataDir = await mkdtemp(join(tmpdir(), "shanhai-community-api-"));
const server = createApp({
  dataDir,
  publicDir: projectRoot,
  adminEmails: ["admin@example.com"],
});

function listen(app) {
  return new Promise((resolveListen) => {
    app.listen(0, "127.0.0.1", () => resolveListen(app.address().port));
  });
}

async function request(port, method, path, body, token) {
  const response = await fetch(`http://127.0.0.1:${port}${path}`, {
    method,
    headers: {
      "content-type": "application/json",
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const text = await response.text();
  const payload = text ? JSON.parse(text) : null;
  return { response, payload };
}

async function register(port, { name, email }) {
  const result = await request(port, "POST", "/api/auth/register", {
    name,
    email,
    password: "correct horse battery",
  });
  assert.equal(result.response.status, 201, `${email} should register`);
  return result.payload;
}

const port = await listen(server);

try {
  const admin = await register(port, { name: "Admin", email: "admin@example.com" });
  const author = await register(port, { name: "Lina Author", email: "author@example.com" });
  const reader = await register(port, { name: "Ming Reader", email: "reader@example.com" });

  const publicMemory = await request(
    port,
    "POST",
    "/api/memories",
    {
      title: "Kyoto temple morning route",
      body: "A field-tested walk from Kiyomizu to Philosopher's Path.",
      locationLabel: "Kyoto, Japan",
      country: "Japan",
      city: "Kyoto",
      destinationId: "kyoto-kiyomizu",
      season: "spring",
      budget: "mid-range",
      audience: "solo travelers",
      route: ["Kiyomizu-dera", "Ninenzaka", "Philosopher's Path"],
      tags: ["kyoto", "temples", "morning"],
      visited: true,
      status: "public",
    },
    author.token,
  );
  assert.equal(publicMemory.response.status, 201, "authors should publish rich public memories");
  assert.equal(publicMemory.payload.memory.destinationId, "kyoto-kiyomizu", "destinationId should persist");
  assert.equal(publicMemory.payload.memory.route.length, 3, "route should persist as an ordered list");
  const publicId = publicMemory.payload.memory.id;

  const unlistedMemory = await request(
    port,
    "POST",
    "/api/memories",
    {
      title: "Hidden ramen alley",
      body: "Shareable by link, not listed in discovery.",
      locationLabel: "Kyoto",
      city: "Kyoto",
      tags: ["food"],
      status: "unlisted",
    },
    author.token,
  );
  assert.equal(unlistedMemory.response.status, 201, "authors should create unlisted memories");
  const unlistedId = unlistedMemory.payload.memory.id;

  const privateMemory = await request(
    port,
    "POST",
    "/api/memories",
    {
      title: "Private Kyoto draft",
      body: "Private planning notes.",
      city: "Kyoto",
      tags: ["draft"],
      status: "private",
    },
    author.token,
  );
  assert.equal(privateMemory.response.status, 201, "authors should keep private memories");

  const discovery = await request(port, "GET", "/api/discover/memories?q=temple&city=Kyoto&tag=kyoto&destinationId=kyoto-kiyomizu&sort=latest");
  assert.equal(discovery.response.status, 200, "public discovery should be readable");
  assert.deepEqual(
    discovery.payload.memories.map((memory) => memory.id),
    [publicId],
    "discovery should include only matching public memories",
  );
  assert.equal(discovery.payload.memories[0].visibility, "public", "public discovery should expose visibility");
  assert.equal(discovery.payload.memories[0].likeCount, 0, "discovery should include interaction counts");

  const unlistedDirect = await request(port, "GET", `/api/public/memories/${unlistedId}`);
  assert.equal(unlistedDirect.response.status, 200, "unlisted memories should be directly readable by link");

  const privateDirect = await request(port, "GET", `/api/public/memories/${privateMemory.payload.memory.id}`);
  assert.equal(privateDirect.response.status, 404, "private memories should not be publicly readable");

  const tags = await request(port, "GET", "/api/tags");
  assert.equal(tags.response.status, 200, "tags should aggregate from public discovery");
  assert.ok(tags.payload.tags.some((tag) => tag.name === "kyoto" && tag.count === 1), "tags should include public counts");

  const destinations = await request(port, "GET", "/api/destinations");
  assert.equal(destinations.response.status, 200, "destinations should aggregate from public discovery");
  assert.ok(destinations.payload.destinations.some((item) => item.destinationId === "kyoto-kiyomizu" && item.count === 1));

  const liked = await request(port, "POST", `/api/memories/${publicId}/like`, undefined, reader.token);
  assert.equal(liked.response.status, 200, "readers should like public memories");
  assert.equal(liked.payload.liked, true);
  assert.equal(liked.payload.likeCount, 1);

  const bookmarked = await request(port, "POST", `/api/memories/${publicId}/bookmark`, undefined, reader.token);
  assert.equal(bookmarked.response.status, 200, "readers should bookmark public memories");
  assert.equal(bookmarked.payload.bookmarked, true);
  assert.equal(bookmarked.payload.bookmarkCount, 1);

  const commented = await request(
    port,
    "POST",
    `/api/memories/${publicId}/comments`,
    { body: "This route is exactly what I need.", parentId: null },
    reader.token,
  );
  assert.equal(commented.response.status, 201, "readers should comment on public memories");
  assert.equal(commented.payload.comment.author.username, reader.user.username, "comments should include public author data");

  const comments = await request(port, "GET", `/api/memories/${publicId}/comments`);
  assert.equal(comments.response.status, 200, "comments should be readable");
  assert.equal(comments.payload.comments.length, 1);
  assert.equal(comments.payload.comments[0].body, "This route is exactly what I need.");

  const followed = await request(port, "POST", `/api/profile/${author.user.username}/follow`, undefined, reader.token);
  assert.equal(followed.response.status, 200, "readers should follow creators by username");
  assert.equal(followed.payload.following, true);
  assert.equal(followed.payload.followerCount, 1);

  const readerDiscovery = await request(port, "GET", `/api/discover/memories?q=kyoto`, undefined, reader.token);
  assert.equal(readerDiscovery.payload.memories[0].likedByViewer, true, "discovery should include viewer like state");
  assert.equal(readerDiscovery.payload.memories[0].bookmarkedByViewer, true, "discovery should include viewer bookmark state");
  assert.equal(readerDiscovery.payload.memories[0].commentCount, 1, "discovery should include comment count");

  const stats = await request(port, "GET", "/api/creator/stats", undefined, author.token);
  assert.equal(stats.response.status, 200, "creators should read their stats");
  assert.deepEqual(
    {
      publicMemories: stats.payload.stats.publicMemories,
      totalLikes: stats.payload.stats.totalLikes,
      totalBookmarks: stats.payload.stats.totalBookmarks,
      totalComments: stats.payload.stats.totalComments,
      followers: stats.payload.stats.followers,
    },
    { publicMemories: 1, totalLikes: 1, totalBookmarks: 1, totalComments: 1, followers: 1 },
  );

  const notifications = await request(port, "GET", "/api/notifications", undefined, author.token);
  assert.equal(notifications.response.status, 200, "authors should read notifications");
  assert.deepEqual(
    notifications.payload.notifications.map((item) => item.type).sort(),
    ["bookmark", "comment", "follow", "like"],
    "author should receive interaction notifications",
  );
  const commentNotification = notifications.payload.notifications.find((item) => item.type === "comment");
  const readNotification = await request(port, "PATCH", `/api/notifications/${commentNotification.id}/read`, undefined, author.token);
  assert.equal(readNotification.response.status, 200, "authors should mark their notifications read");
  assert.ok(readNotification.payload.notification.readAt, "marking a notification read should persist readAt");
  const readerReadAttempt = await request(port, "PATCH", `/api/notifications/${commentNotification.id}/read`, undefined, reader.token);
  assert.equal(readerReadAttempt.response.status, 404, "readers should not mark another user's notifications read");

  const report = await request(
    port,
    "POST",
    "/api/reports",
    { targetType: "memory", targetId: publicId, reason: "Safety details need review." },
    reader.token,
  );
  assert.equal(report.response.status, 201, "readers should report public content");
  assert.equal(report.payload.report.status, "open");

  const adminReports = await request(port, "GET", "/api/admin/reports", undefined, admin.token);
  assert.equal(adminReports.response.status, 200, "admins should list reports");
  assert.equal(adminReports.payload.reports.length, 1);

  const nonAdminReports = await request(port, "GET", "/api/admin/reports", undefined, reader.token);
  assert.equal(nonAdminReports.response.status, 403, "non-admin users should not access moderation reports");

  const moderated = await request(
    port,
    "PATCH",
    `/api/admin/reports/${report.payload.report.id}`,
    { status: "removed", action: "remove_memory", notes: "Removed from public discovery." },
    admin.token,
  );
  assert.equal(moderated.response.status, 200, "admins should moderate reported content");
  assert.equal(moderated.payload.report.status, "removed");

  const afterModeration = await request(port, "GET", "/api/discover/memories?q=kyoto");
  assert.equal(afterModeration.payload.memories.length, 0, "removed content should leave discovery");
} finally {
  await new Promise((resolveClose) => server.close(resolveClose));
  await rm(dataDir, { recursive: true, force: true });
}
