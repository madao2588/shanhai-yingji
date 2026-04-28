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
} finally {
  await browser.close();
}
