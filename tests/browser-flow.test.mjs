import assert from "node:assert/strict";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { chromium } from "playwright";

const projectRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const pageUrl = pathToFileURL(resolve(projectRoot, "index.html")).href;

const browser = await chromium.launch();
const page = await browser.newPage();

try {
  await page.goto(pageUrl);
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.waitForFunction(() => document.querySelector("#splash")?.classList.contains("is-hidden"));

  await page.click('[data-target="create"]');
  const urlBeforeEnter = page.url();
  await page.focus("[data-create-title]");
  await page.keyboard.press("Enter");
  assert.equal(page.url(), urlBeforeEnter, "pressing Enter in the create form should not navigate or reload");

  await page.setInputFiles("[data-photo-input]", {
    name: "kyoto-local.png",
    mimeType: "image/png",
    buffer: Buffer.from("tiny-image"),
  });
  await page.waitForSelector('[data-photo-id^="local-"]');
  const importedSrc = await page.locator('[data-photo-id^="local-"]').first().getAttribute("data-photo-src");

  assert.match(importedSrc, /^data:image\/png;base64,/, "local imported photos should be stored as data URLs");

  const selectedCards = page.locator("[data-selected-photo-card]");
  assert.equal(await selectedCards.count(), 3, "selected photos should render as manageable cards");
  await selectedCards.last().locator("[data-selected-photo-up]").click();
  await selectedCards.nth(1).locator("[data-selected-photo-up]").click();
  await selectedCards.nth(1).locator("[data-selected-photo-remove]").click();

  const selectedPlaces = await selectedCards.locator("h3").allTextContents();
  assert.deepEqual(
    selectedPlaces,
    ["kyoto local", "二年坂"],
    "selected photos should support reordering and removal before saving"
  );

  await page.fill("[data-create-title]", "草稿里的映记");
  await page.fill("[data-create-location]", "葡萄牙里斯本");
  await page.fill("[data-create-body]", "刷新之后仍然要留住这段尚未保存的旅行回忆");
  await page.reload();
  await page.waitForFunction(() => document.querySelector("#splash")?.classList.contains("is-hidden"));

  assert.equal(await page.locator("[data-create-title]").inputValue(), "草稿里的映记", "create title draft should restore after reload");
  assert.equal(await page.locator("[data-create-location]").inputValue(), "葡萄牙里斯本", "create location draft should restore after reload");
  assert.equal(
    await page.locator("[data-create-body]").inputValue(),
    "刷新之后仍然要留住这段尚未保存的旅行回忆",
    "create body draft should restore after reload"
  );
  assert.deepEqual(
    await page.locator("[data-selected-photo-card] h3").allTextContents(),
    ["kyoto local", "二年坂"],
    "selected photo order should restore from the draft after reload"
  );

  await page.fill("[data-create-title]", "测试收藏映记");
  await page.fill("[data-create-location]", "日本京都");
  await page.fill("[data-create-body]", "收藏筛选和删除测试");
  await page.click("[data-save-memory]");
  await page.waitForFunction(() => document.querySelector("[data-save-status]")?.textContent.includes("已写入"));
  assert.equal(await page.evaluate(() => localStorage.getItem("shanhai-create-draft")), null, "saving should clear the create draft");

  await page.click('[data-target="record"]');
  await page.click("[data-open-archive]");
  await page.waitForSelector("[data-archive-favorite]");
  await page.locator("[data-archive-favorite]").first().click();
  await page.click('[data-archive-filter="favorite"]');
  await page.waitForFunction(() => document.querySelector("[data-archive-list]")?.textContent.includes("测试收藏映记"));

  page.once("dialog", (dialog) => dialog.accept());
  await page.locator("[data-archive-delete]").first().click();
  await page.waitForFunction(() => !document.querySelector("[data-archive-list]")?.textContent.includes("测试收藏映记"));

  await page.setInputFiles("[data-import-archive-input]", {
    name: "archive.json",
    mimeType: "application/json",
    buffer: Buffer.from(
      JSON.stringify({
        version: 1,
        memories: [{ id: "imported-one", title: "导入映记", body: "从 JSON 恢复", source: "saved", location: "日本京都" }],
        destinationState: { wants: ["kiyomizu"], plans: [] },
      })
    ),
  });
  await page.waitForFunction(() => document.querySelector("[data-archive-transfer-status]")?.textContent.includes("导入完成"));
  await page.click('[data-archive-filter="all"]');
  await page.waitForFunction(() => document.querySelector("[data-archive-list]")?.textContent.includes("导入映记"));

  await page.locator("[data-archive-edit]").first().click();
  await page.waitForSelector("[data-edit-panel]:not([hidden])");
  await page.fill("[data-edit-title]", "导入映记已编辑");
  await page.fill("[data-edit-location]", "冰岛维克");
  await page.fill("[data-edit-route]", "维克 -> 黑沙滩");
  await page.fill("[data-edit-photos]", "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?auto=format&fit=crop&w=420&q=82");
  await page.fill("[data-edit-tags]", "导入,精选");
  await page.click("[data-edit-save]");
  await page.waitForFunction(() => document.querySelector("[data-archive-list]")?.textContent.includes("导入映记已编辑"));
  await page.waitForFunction(() => document.querySelector("[data-archive-list]")?.textContent.includes("冰岛"));
  await page.click('[data-archive-filter="tagged"]');
  await page.waitForFunction(() => document.querySelector("[data-archive-list]")?.textContent.includes("精选"));
  await page.click('[data-archive-filter="iceland"]');
  await page.waitForFunction(() => document.querySelector("[data-archive-list]")?.textContent.includes("导入映记已编辑"));
} finally {
  await browser.close();
}
