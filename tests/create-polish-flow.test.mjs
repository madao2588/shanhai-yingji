import assert from "node:assert/strict";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { chromium } from "playwright";

const projectRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const pageUrl = pathToFileURL(resolve(projectRoot, "index.html")).href;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });

try {
  await page.goto(pageUrl);
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.waitForFunction(() => document.querySelector("#splash")?.classList.contains("is-hidden"));

  await page.click('[data-target="create"]');
  await page.fill("[data-create-title]", "海岸线晨光试写");
  await page.fill("[data-create-location]", "2026.05.08 · 中国厦门");
  await page.fill("[data-create-date]", "2026-05-08");
  await page.fill("[data-create-route]", "沙坡尾 -> 演武大桥 -> 环岛路");
  await page.fill("[data-create-tags]", "厦门,海岸,晨光");
  await page.selectOption("[data-create-visibility]", "public");
  await page.fill("[data-create-body]", "天刚亮的时候，海面像一张还没有写完的明信片。");

  await page.reload();
  await page.waitForFunction(() => document.querySelector("#splash")?.classList.contains("is-hidden"));
  await page.click('[data-target="create"]');
  assert.equal(await page.locator("[data-create-date]").inputValue(), "2026-05-08", "create date should restore from draft");
  assert.equal(await page.locator("[data-create-route]").inputValue(), "沙坡尾 -> 演武大桥 -> 环岛路", "route should restore from draft");
  assert.equal(await page.locator("[data-create-tags]").inputValue(), "厦门,海岸,晨光", "tags should restore from draft");
  assert.equal(await page.locator("[data-create-visibility]").inputValue(), "public", "visibility should restore from draft");

  await page.click("[data-save-memory]");
  await page.waitForFunction(() => document.querySelector("[data-save-status]")?.textContent.includes("公开"));
  assert.equal(await page.evaluate(() => localStorage.getItem("shanhai-create-draft")), null, "saving should clear the full create draft");

  await page.click('[data-target="record"]');
  await page.click("[data-open-archive]");
  await page.waitForFunction(() => document.querySelector("[data-archive-list]")?.textContent.includes("海岸线晨光试写"));
  await page.locator("[data-archive-list] [data-memory-id]").first().click();
  await page.waitForSelector('[data-screen="memory-detail"].is-active');
  assert.match(await page.locator("[data-memory-status-chip]").textContent(), /公开/, "detail should expose publish visibility");
  assert.match(await page.locator("[data-memory-tags]").textContent(), /海岸/, "detail should expose structured tags");
  assert.match(await page.locator("[data-memory-route]").textContent(), /沙坡尾/, "detail should use the edited route");

  await page.click('[data-target="profile"]');
  await page.click("[data-open-profile-space]");
  await page.waitForSelector('[data-screen="profile-space"].is-active');
  assert.match(await page.locator("[data-profile-space-counters]").textContent(), /公开 1/, "profile space should count public local memories");
  assert.match(await page.locator("[data-profile-space-list]").textContent(), /海岸线晨光试写/, "profile space should list created memories");
  assert.match(await page.locator("[data-profile-space-list]").textContent(), /公开/, "profile space should show publish status");

  await page.click('[data-target="create"]');
  await page.fill("[data-create-title]", "夜游私密草稿");
  await page.fill("[data-create-location]", "2026.05.09 · 中国广州");
  await page.fill("[data-create-date]", "2026-05-09");
  await page.fill("[data-create-route]", "东山口 -> 珠江边");
  await page.fill("[data-create-tags]", "广州,夜游");
  await page.selectOption("[data-create-visibility]", "private");
  await page.fill("[data-create-body]", "这一段先只留给自己整理。");
  await page.click("[data-save-memory]");
  await page.waitForFunction(() => document.querySelector("[data-save-status]")?.textContent.includes("私密"));

  await page.click('[data-target="profile"]');
  await page.click("[data-open-profile-space]");
  await page.waitForSelector('[data-screen="profile-space"].is-active');
  const counters = await page.locator("[data-profile-space-counters]").textContent();
  assert.match(counters, /公开 1/, "public count should remain stable");
  assert.match(counters, /私密 1/, "profile space should count private local memories");
  assert.match(await page.locator("[data-profile-space-list]").textContent(), /夜游私密草稿/, "profile space should include private local memories for owner management");
} finally {
  await browser.close();
}
