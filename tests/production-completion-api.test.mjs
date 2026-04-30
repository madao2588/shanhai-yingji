import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { createApp } = require("../server/app.cjs");

const projectRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const dataDir = await mkdtemp(join(tmpdir(), "shanhai-production-completion-"));
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

async function register(port, email, name = "Traveler") {
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
  const admin = await register(port, "admin@example.com", "Ops Admin");
  const user = await register(port, "traveler@example.com", "Launch Traveler");

  const updatedProfile = await request(
    port,
    "PATCH",
    "/api/me",
    { name: "Launch Creator", username: "launch-creator" },
    user.token,
  );
  assert.equal(updatedProfile.response.status, 200, "users should update profile");
  assert.equal(updatedProfile.payload.user.name, "Launch Creator");
  assert.equal(updatedProfile.payload.user.username, "launch-creator");

  const memory = await request(
    port,
    "POST",
    "/api/memories",
    {
      title: "Production photo management",
      body: "Photo deletion must be persistent.",
      locationLabel: "Lisbon",
      status: "public",
    },
    user.token,
  );
  assert.equal(memory.response.status, 201);
  const memoryId = memory.payload.memory.id;

  const uploaded = await request(
    port,
    "POST",
    `/api/memories/${memoryId}/photos`,
    {
      fileName: "lisbon.png",
      mimeType: "image/png",
      dataUrl: "data:image/png;base64,dGlueS1pbWFnZQ==",
      alt: "Lisbon tile route",
    },
    user.token,
  );
  assert.equal(uploaded.response.status, 201, "users should upload photos");
  const photoId = uploaded.payload.photo.id;

  const deletedPhoto = await request(port, "DELETE", `/api/memories/${memoryId}/photos/${photoId}`, undefined, user.token);
  assert.equal(deletedPhoto.response.status, 204, "users should delete uploaded photos");

  const afterPhotoDelete = await request(port, "GET", `/api/memories/${memoryId}`, undefined, user.token);
  assert.equal(afterPhotoDelete.response.status, 200);
  assert.equal(afterPhotoDelete.payload.memory.photos.length, 0, "deleted photos should leave memory metadata");

  const metrics = await request(port, "GET", "/api/admin/metrics", undefined, admin.token);
  assert.equal(metrics.response.status, 200, "admins should read operational metrics");
  assert.equal(metrics.payload.metrics.users, 2);
  assert.equal(metrics.payload.metrics.memories, 1);
  assert.equal(metrics.payload.metrics.photos, 0);

  const backup = await request(port, "GET", "/api/admin/backup", undefined, admin.token);
  assert.equal(backup.response.status, 200, "admins should export a backup snapshot");
  assert.ok(backup.payload.backup.exportedAt, "backup should include exportedAt");
  assert.equal(backup.payload.backup.data.users.length, 2, "backup should include users");

  const nonAdminMetrics = await request(port, "GET", "/api/admin/metrics", undefined, user.token);
  assert.equal(nonAdminMetrics.response.status, 403, "non-admin users should not read metrics");

  const deleteAccount = await request(port, "DELETE", "/api/me", undefined, user.token);
  assert.equal(deleteAccount.response.status, 204, "users should delete their own account");

  const afterDeleteMe = await request(port, "GET", "/api/me", undefined, user.token);
  assert.equal(afterDeleteMe.response.status, 401, "deleted account token should stop authenticating");
} finally {
  await new Promise((resolveClose) => server.close(resolveClose));
  await rm(dataDir, { recursive: true, force: true });
}
