import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { chromium } from "playwright";

const require = createRequire(import.meta.url);
const { createApp } = require("../server/app.cjs");

const projectRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const dataDir = await mkdtemp(join(tmpdir(), "shanhai-community-browser-"));
const server = createApp({ dataDir, publicDir: projectRoot });

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
  assert.ok(response.ok, `${method} ${path} should succeed: ${response.status}`);
  return payload;
}

const port = await listen(server);
const browser = await chromium.launch();
const page = await browser.newPage();
const consoleErrors = [];
const failedRequests = [];

page.on("console", (message) => {
  if (message.type() === "error") {
    consoleErrors.push(message.text());
  }
});
page.on("requestfailed", (request) => {
  failedRequests.push(`${request.method()} ${request.url()} ${request.failure()?.errorText || ""}`);
});

try {
  await page.goto(`http://127.0.0.1:${port}/index.html#community`, { waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => document.querySelector("#splash")?.classList.contains("is-hidden"));

  await page.click('[data-target="profile"]');
  await page.click("[data-profile-avatar-edit]");
  await page.waitForSelector('[data-screen="profile-space"].is-active');
  await page.click("[data-profile-space-edit]");
  await page.waitForSelector("[data-profile-edit-panel]:not([hidden])");
  await page.fill("[data-cloud-name]", "Community Author");
  await page.fill("[data-cloud-email]", "community-author@example.com");
  await page.fill("[data-cloud-password]", "community-pass-123");
  await page.click("[data-cloud-register]");
  await page.waitForFunction(() => document.querySelector("[data-cloud-status]")?.textContent.includes("已登录"));
  await page.click('[data-target="profile"]');

  await page.fill("[data-cloud-title]", "Lisbon tile route");
  await page.fill("[data-cloud-location]", "Portugal Lisbon");
  await page.fill("[data-cloud-body]", "A public route for azulejo streets and river viewpoints.");
  await page.selectOption("[data-cloud-privacy]", "public");
  await page.fill("[data-cloud-tags]", "lisbon,tiles,river");
  await page.click("[data-cloud-save-memory]");
  await page.waitForFunction(() => document.querySelector("[data-cloud-status]")?.textContent.includes("云端日志已保存"));

  const authorToken = await page.evaluate(() => window.sessionStorage.getItem("shanhai-api-token"));
  const authorProfile = await request(port, "GET", "/api/me", undefined, authorToken);
  const authorMemories = await request(port, "GET", "/api/memories", undefined, authorToken);
  const publishedMemory = authorMemories.memories.find((memory) => memory.title === "Lisbon tile route");
  assert.ok(publishedMemory?.id, "published memory should be available for cross-user notification setup");
  const reader = await request(port, "POST", "/api/auth/register", {
    name: "Message Reader",
    email: "message-reader@example.com",
    password: "reader-pass-123",
  });
  await request(port, "POST", `/api/memories/${publishedMemory.id}/like`, undefined, reader.token);
  await request(port, "POST", `/api/memories/${publishedMemory.id}/bookmark`, undefined, reader.token);
  await request(port, "POST", `/api/memories/${publishedMemory.id}/comments`, { body: "Notification should open this public memory." }, reader.token);
  await request(port, "POST", `/api/profile/${authorProfile.user.username}/follow`, undefined, reader.token);

  await page.click('[data-target="community"]');
  await page.waitForSelector("[data-community-feed] [data-community-item]");
  await page.fill("[data-community-search-input]", "Lisbon");
  await page.click("[data-community-search-action]");
  await page.waitForFunction(() => document.querySelector("[data-community-feed]")?.textContent.includes("Lisbon tile route"));

  await page.click("[data-community-like]");
  await page.waitForFunction(() => document.querySelector("[data-community-feed]")?.textContent.includes("1 喜欢"));
  await page.click("[data-community-bookmark]");
  await page.waitForFunction(() => document.querySelector("[data-community-feed]")?.textContent.includes("已收藏"));
  await page.fill("[data-community-comment-input]", "Saving this for my next city walk.");
  await page.click("[data-community-comment-submit]");
  await page.waitForFunction(() => document.querySelector("[data-community-feed]")?.textContent.includes("1 评论"));

  await page.click('[data-target="profile"]');
  await page.waitForFunction(() => document.querySelector("[data-creator-stats]")?.textContent.includes("1"));
  await page.click('[data-target="messages"]');
  await page.waitForSelector(`[data-notification-memory-id="${publishedMemory.id}"]`);
  await page.click(`[data-notification-memory-id="${publishedMemory.id}"]`);
  await page.waitForSelector('[data-screen="memory-detail"].is-active');
  assert.equal(await page.locator("[data-memory-title]").textContent(), "Lisbon tile route", "notification should open the related public memory");
  await page.waitForFunction(() => document.querySelector("[data-memory-comments]")?.textContent.includes("Notification should open this public memory."));

  assert.deepEqual(consoleErrors, [], "community browser flow should not log console errors");
  assert.deepEqual(failedRequests, [], "community browser flow should not have failed resource requests");
} finally {
  await browser.close();
  await new Promise((resolveClose) => server.close(resolveClose));
  await rm(dataDir, { recursive: true, force: true });
}
