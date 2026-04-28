import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { homedir } from "node:os";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const require = createRequire(import.meta.url);
const bundledNodeModules =
  process.env.CODEX_BUNDLED_NODE_MODULES ||
  resolve(homedir(), ".cache", "codex-runtimes", "codex-primary-runtime", "dependencies", "node", "node_modules");
const playwright = require(require.resolve("playwright", { paths: [bundledNodeModules] }));

const projectRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const pageUrl = pathToFileURL(resolve(projectRoot, "index.html")).href;

const browser = await playwright.chromium.launch();
const page = await browser.newPage();

try {
  await page.goto(pageUrl);
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

  await page.fill("[data-create-title]", "测试收藏映记");
  await page.fill("[data-create-location]", "日本京都");
  await page.fill("[data-create-body]", "收藏筛选和删除测试");
  await page.click("[data-save-memory]");
  await page.waitForFunction(() => document.querySelector("[data-save-status]")?.textContent.includes("已写入"));

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
} finally {
  await browser.close();
}
