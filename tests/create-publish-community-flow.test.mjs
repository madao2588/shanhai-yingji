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
const dataDir = await mkdtemp(join(tmpdir(), "shanhai-create-publish-"));
const server = createApp({ dataDir, publicDir: projectRoot });

function listen(app) {
  return new Promise((resolveListen) => {
    app.listen(0, "127.0.0.1", () => resolveListen(app.address().port));
  });
}

const port = await listen(server);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
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
  await page.goto(`http://127.0.0.1:${port}/index.html#create`, { waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => document.querySelector("#splash")?.classList.contains("is-hidden"));

  await page.click('[data-target="profile"]');
  await page.click("[data-profile-avatar-edit]");
  await page.waitForSelector('[data-screen="profile-space"].is-active');
  await page.click("[data-profile-space-edit]");
  await page.waitForSelector("[data-profile-edit-panel]:not([hidden])");
  await page.fill("[data-cloud-name]", "Create Publisher");
  await page.fill("[data-cloud-email]", "create-publisher@example.com");
  await page.fill("[data-cloud-password]", "create-publisher-pass");
  await page.click("[data-cloud-register]");
  await page.waitForFunction(() => document.querySelector("[data-cloud-status]")?.textContent.includes("已登录"));

  await page.click('[data-target="create"]');
  await page.fill("[data-create-title]", "主创建页公开发布路线");
  await page.fill("[data-create-location]", "2026.05.08 · 中国苏州");
  await page.fill("[data-create-date]", "2026-05-08");
  await page.fill("[data-create-route]", "平江路 -> 拙政园 -> 山塘街");
  await page.fill("[data-create-tags]", "苏州,园林,步行");
  await page.selectOption("[data-create-visibility]", "public");
  await page.fill("[data-create-body]", "从主创建页直接发布到社区发现，验证真实内测闭环。");
  await page.setInputFiles("[data-photo-input]", {
    name: "suzhou-walk.png",
    mimeType: "image/png",
    buffer: Buffer.from("tiny-public-photo"),
  });
  await page.waitForSelector('[data-photo-id^="local-"]');
  await page.click("[data-save-memory]");
  await page.waitForFunction(() => document.querySelector("[data-save-status]")?.textContent.includes("云端"));

  await page.click('[data-target="profile"]');
  await page.waitForFunction(() => document.querySelector("[data-cloud-memory-list]")?.textContent.includes("主创建页公开发布路线"));
  await page.waitForFunction(() => document.querySelector("[data-public-memory-list]")?.textContent.includes("主创建页公开发布路线"));
  await page.waitForFunction(() => document.querySelector("[data-creator-public-memories]")?.textContent === "1");
  await page.click("[data-cloud-memory-id]");
  assert.equal(await page.locator("[data-cloud-title]").inputValue(), "主创建页公开发布路线", "cloud memory selection should refill the editor title");
  assert.equal(await page.locator("[data-cloud-location]").inputValue(), "2026.05.08 · 中国苏州", "cloud memory selection should refill location");
  assert.equal(await page.locator("[data-cloud-privacy]").inputValue(), "public", "cloud memory selection should refill publish status");
  assert.match(await page.locator("[data-cloud-tags]").inputValue(), /园林/, "cloud memory selection should refill tags");
  assert.match(await page.locator("[data-cloud-photo-list]").textContent(), /suzhou walk|主创建页公开发布路线/, "cloud memory selection should expose uploaded photos");

  await page.fill("[data-cloud-body]", "Updated from the cloud manager without creating a duplicate.");
  await page.fill("[data-cloud-location]", "2026.05.09 · 中国苏州");
  await page.click("[data-cloud-save-memory]");
  await page.waitForFunction(() => document.querySelector("[data-cloud-status]")?.textContent.includes("更新"));
  assert.equal(await page.locator("[data-cloud-memory-id]").count(), 1, "updating a selected cloud memory should not create a duplicate");
  await page.waitForFunction(() => document.querySelector("[data-cloud-memory-list]")?.textContent.includes("2026.05.09"));
  await page.click("[data-cloud-delete-photo]");
  await page.waitForFunction(() => document.querySelector("[data-cloud-status]")?.textContent.includes("照片已删除"));
  await page.waitForFunction(() => document.querySelector("[data-cloud-photo-list]")?.textContent.includes("还没有照片"));
  await page.click("[data-cloud-new-memory]");
  assert.equal(await page.locator("[data-cloud-title]").inputValue(), "", "new memory action should clear the selected editor");
  await page.fill("[data-cloud-title]", "Private follow-up draft");
  await page.fill("[data-cloud-location]", "Draft city");
  await page.fill("[data-cloud-body]", "A separate private draft from the manager.");
  await page.selectOption("[data-cloud-privacy]", "private");
  await page.fill("[data-cloud-tags]", "draft");
  await page.click("[data-cloud-save-memory]");
  await page.waitForFunction(() => document.querySelector("[data-cloud-status]")?.textContent.includes("保存"));
  assert.equal(await page.locator("[data-cloud-memory-id]").count(), 2, "new memory action should allow creating a separate cloud memory");
  await page.click("[data-open-profile-space]");
  await page.waitForSelector('[data-screen="profile-space"].is-active');
  await page.waitForFunction(() => document.querySelector("[data-profile-space-list]")?.textContent.includes("Private follow-up draft"));
  await page.waitForFunction(() => document.querySelector("[data-profile-space-counters]")?.textContent.includes("私密 1"));
  await page.click('[data-target="profile"]');
  await page.click("[data-cloud-delete-memory]");
  await page.waitForFunction(() => document.querySelector("[data-cloud-status]")?.textContent.includes("删除"));
  assert.equal(await page.locator("[data-cloud-memory-id]").count(), 1, "deleting the selected cloud memory should remove it from the manager");

  await page.click('[data-target="community"]');
  await page.fill("[data-community-search-input]", "苏州");
  await page.click("[data-community-search-action]");
  await page.waitForFunction(() => document.querySelector("[data-community-feed]")?.textContent.includes("主创建页公开发布路线"));
  assert.match(await page.locator("[data-community-feed]").textContent(), /0 喜欢|旅行映记/, "published memory should render as a community card");
  assert.match(
    await page.locator('[data-community-item] img').first().getAttribute("src"),
    /^assets\/photo-ocean\.svg$/,
    "community feed should fall back after deleting the selected cloud photo"
  );

  await page.locator('[data-community-item]').first().click();
  await page.waitForSelector('[data-screen="memory-detail"].is-active');
  assert.equal(await page.locator("[data-memory-title]").textContent(), "主创建页公开发布路线", "community card should open a detail view");
  assert.match(await page.locator("[data-memory-status-chip]").textContent(), /公开/, "public detail should retain publish status");
  assert.match(await page.locator("[data-memory-tags]").textContent(), /园林/, "public detail should retain tags");
  assert.match(await page.locator("[data-memory-route]").textContent(), /平江路/, "public detail should retain the structured route");

  await page.fill("[data-memory-comment-input]", "Detail comments now work.");
  await page.click("[data-memory-comment-submit]");
  await page.waitForFunction(() => document.querySelector("[data-memory-comments]")?.textContent.includes("Detail comments now work."));
  await page.waitForFunction(() => document.querySelector("[data-memory-comment-status]")?.textContent.includes("1 条评论"));

  assert.deepEqual(consoleErrors, [], "create publish flow should not log console errors");
  assert.deepEqual(failedRequests, [], "create publish flow should not have failed resource requests");
} finally {
  await browser.close();
  await new Promise((resolveClose) => server.close(resolveClose));
  await rm(dataDir, { recursive: true, force: true });
}
