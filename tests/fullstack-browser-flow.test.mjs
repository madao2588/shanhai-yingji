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
const dataDir = await mkdtemp(join(tmpdir(), "shanhai-browser-"));
const server = createApp({ dataDir, publicDir: projectRoot });

function listen(app) {
  return new Promise((resolveListen) => {
    app.listen(0, "127.0.0.1", () => resolveListen(app.address().port));
  });
}

const port = await listen(server);
const browser = await chromium.launch();
const page = await browser.newPage();

try {
  await page.goto(`http://127.0.0.1:${port}/index.html`, { waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => document.querySelector("#splash")?.classList.contains("is-hidden"));
  await page.click('[data-target="profile"]');
  await page.click("[data-profile-avatar-edit]");
  await page.waitForSelector('[data-screen="profile-space"].is-active');
  await page.click("[data-profile-space-edit]");
  await page.waitForSelector("[data-profile-edit-panel]:not([hidden])");

  await page.fill("[data-cloud-name]", "移动端用户");
  await page.fill("[data-cloud-email]", "mobile@example.com");
  await page.fill("[data-cloud-password]", "mobile-pass-123");
  await page.click("[data-cloud-register]");
  await page.waitForFunction(() => document.querySelector("[data-cloud-status]")?.textContent.includes("已登录"));
  await page.click('[data-target="profile"]');

  await page.fill("[data-cloud-title]", "移动端公开日志");
  await page.fill("[data-cloud-location]", "中国杭州");
  await page.fill("[data-cloud-body]", "这是一篇通过后端保存的旅行日志。");
  await page.selectOption("[data-cloud-privacy]", "public");
  await page.fill("[data-cloud-tags]", "后端,上线");
  await page.click("[data-cloud-save-memory]");
  await page.waitForFunction(() => document.querySelector("[data-cloud-status]")?.textContent.includes("云端日志已保存"));

  await page.setInputFiles("[data-cloud-photo-input]", {
    name: "hangzhou.png",
    mimeType: "image/png",
    buffer: Buffer.from("tiny-image"),
  });
  await page.click("[data-cloud-upload-photo]");
  await page.waitForFunction(() => document.querySelector("[data-cloud-status]")?.textContent.includes("照片已上传"));

  await page.waitForFunction(() => document.querySelector("[data-public-memory-list]")?.textContent.includes("移动端公开日志"));
  assert.match(await page.locator("[data-cloud-profile]").textContent(), /移动端用户/, "cloud profile should show the signed-in user");

  const cloudReply = "cloud-sync-message-0508";
  await page.click('[data-target="messages"]');
  await page.click('[data-conversation-item="mori"]');
  await page.fill("[data-conversation-message-input]", cloudReply);
  await page.click("[data-conversation-send]");
  await page.waitForFunction((reply) => document.querySelector("[data-conversation-thread]")?.textContent.includes(reply), cloudReply);
  await page.waitForFunction(() => /云端|sync/i.test(document.querySelector("[data-message-thread-state]")?.textContent || ""));
  await page.evaluate(() => window.localStorage.removeItem("shanhai-conversation-state"));

  await page.reload({ waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => document.querySelector("#splash")?.classList.contains("is-hidden"));
  await page.click('[data-target="messages"]');
  await page.click('[data-conversation-item="mori"]');
  await page.waitForFunction((reply) => document.querySelector("[data-conversation-thread]")?.textContent.includes(reply), cloudReply);
  await page.click('[data-target="profile"]');
  await page.waitForFunction(() => document.querySelector("[data-cloud-status]")?.textContent.includes("已恢复登录"));
  await page.waitForFunction(() => document.querySelector("[data-cloud-memory-list]")?.textContent.includes("移动端公开日志"));
} finally {
  await browser.close();
  await new Promise((resolveClose) => server.close(resolveClose));
  await rm(dataDir, { recursive: true, force: true });
}
