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
  await page.waitForSelector("[data-notification-list] [data-notification-item]");

  assert.deepEqual(consoleErrors, [], "community browser flow should not log console errors");
  assert.deepEqual(failedRequests, [], "community browser flow should not have failed resource requests");
} finally {
  await browser.close();
  await new Promise((resolveClose) => server.close(resolveClose));
  await rm(dataDir, { recursive: true, force: true });
}
