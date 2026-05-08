import assert from "node:assert/strict";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { chromium } from "playwright";

const require = createRequire(import.meta.url);
const { createApp } = require("../server/app.cjs");
const projectRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const dataDir = await mkdtemp(join(tmpdir(), "shanhai-ui-feedback-"));
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
  await page.goto(`http://127.0.0.1:${port}/index.html#record`, { waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => document.querySelector("#splash")?.classList.contains("is-hidden"));
  assert.equal(
    await page.evaluate(() => document.elementFromPoint(60, 160)?.closest("#splash") === null),
    true,
    "hidden splash should not cover the active screen"
  );
  assert.equal(await page.locator("[data-ink-landscape]").count(), 1, "app should render the ink landscape layer");
  assert.equal(
    await page.locator("[data-ink-landscape]").evaluate((node) => getComputedStyle(node).pointerEvents),
    "none",
    "ink landscape should not intercept taps"
  );
  assert.equal(
    await page.locator(".screens").evaluate((node) => Number(getComputedStyle(node).zIndex) >= 1),
    true,
    "screens should render above the ink landscape"
  );
  assert.equal(await page.locator(".ink-moon").count(), 1, "ink landscape should include a visible moon/sun wash");
  assert.equal(await page.locator(".ink-cloud-bank").count(), 1, "ink landscape should include a visible cloud and water wash");
  assert.equal(await page.locator(".ink-landscape-art").count(), 1, "ink landscape should include explicit shanshui artwork");
  assert.equal(await page.locator(".ink-pine-stroke").count(), 1, "ink landscape should include an unmistakable ink brush stroke");
  assert.equal(
    await page.locator(".screen.is-active").evaluate((node) => getComputedStyle(node).backgroundColor),
    "rgba(0, 0, 0, 0)",
    "active screen should stay transparent so the ink landscape remains visible"
  );
  assert.match(
    await page.locator(".screen.is-active").evaluate((node) => getComputedStyle(node).getPropertyValue("--screen-bg-image")),
    /bg-record-ink\.png/,
    "record screen should use the generated ink painting background"
  );
  assert.match(
    await page.locator(".bottom-nav button").first().evaluate((node) => getComputedStyle(node).transitionProperty),
    /transform|box-shadow|background|color/,
    "navigation buttons should have animated interaction feedback"
  );
  assert.notEqual(
    await page.locator('.bottom-nav button.is-active').evaluate((node) => getComputedStyle(node, "::before").opacity),
    "0",
    "active navigation button should reveal a visual pill"
  );
  assert.match(
    await page.locator("[data-record-next-action]").evaluate((node) => getComputedStyle(node).boxShadow),
    /rgb|rgba/,
    "record action buttons should have tactile elevation"
  );
  assert.equal(await page.locator("[data-record-overview]").count(), 1, "record home should show a normal app overview");
  assert.match(await page.locator("[data-record-latest-title]").textContent(), /京都|映记|memory/i, "record overview should show latest memory");
  assert.match(await page.locator("[data-record-visibility]").textContent(), /私密|公开|待创建|private|public/i, "record overview should show visibility mix or an empty local state");
  assert.match(await page.locator("[data-record-next-action]").textContent(), /继续|创建|整理|create/i, "record overview should show a next action");

  await page.click("[data-open-map-browse]");
  await page.waitForSelector('[data-browse-panel]:not([hidden])');
  assert.match(await page.locator("[data-browse-panel]").textContent(), /足迹|城市|路线/, "map browse panel should show reviewable trip content");
  await page.click("[data-browse-close]");

  await page.click('[data-mode="diary"]');
  await page.click("[data-open-diary-browse]");
  await page.waitForSelector('[data-browse-panel]:not([hidden])');
  assert.match(await page.locator("[data-browse-panel]").textContent(), /日记|映记|回望/, "diary browse panel should show diary content");
  await page.click("[data-browse-close]");

  await page.click('[data-target="community"]');
  assert.match(
    await page.locator(".screen.is-active").evaluate((node) => getComputedStyle(node).getPropertyValue("--screen-bg-image")),
    /bg-community-ink\.png/,
    "community screen should use its generated ink painting background"
  );
  await page.click('[data-community-tab="featured"]');
  await page.waitForSelector('[data-community-panel="featured"]:not([hidden])');
  assert.match(await page.locator("[data-community-channel]").textContent(), /精选|公开/, "featured tab should visibly change the active channel");
  await page.click('[data-community-tab="nearby"]');
  await page.waitForSelector('[data-community-panel="nearby"]:not([hidden])');
  assert.match(await page.locator("[data-community-channel]").textContent(), /附近|动态/, "nearby tab should visibly change the active channel");
  await page.click('[data-community-tab="cities"]');
  await page.waitForSelector('[data-community-panel="cities"]:not([hidden])');
  await page.click('[data-community-quick-query="冰岛"]');
  await page.waitForFunction(() => document.querySelector("[data-community-discovery-summary]")?.textContent.includes("冰岛"));
  assert.match(await page.locator("[data-community-discovery-summary]").textContent(), /冰岛|结果|点评/, "quick queries should update discovery feedback");
  assert.equal(await page.locator(".search-button").count(), 0, "community header should not keep a redundant empty search icon");

  await page.click('[data-target="messages"]');
  assert.match(
    await page.locator(".screen.is-active").evaluate((node) => getComputedStyle(node).getPropertyValue("--screen-bg-image")),
    /bg-messages-ink\.png/,
    "messages screen should use its generated ink painting background"
  );
  assert.equal(await page.locator("[data-message-inbox-summary]").count(), 1, "messages should show a normal inbox summary");
  assert.equal(await page.locator("[data-message-unread-count]").count(), 1, "messages should show unread counts");
  assert.equal(await page.locator("[data-conversation-preview]").count() >= 3, true, "conversation rows should expose mutable previews");
  assert.equal(await page.locator("[data-conversation-unread]").count() >= 3, true, "conversation rows should expose read state");
  await page.click('[data-conversation-item="lin-che"]');
  await page.waitForSelector('[data-conversation-thread]:not([hidden])');
  await page.fill("[data-conversation-message-input]", "   ");
  await page.click("[data-conversation-send]");
  assert.equal(await page.locator('[data-conversation-messages] .from-me').count(), 1, "empty replies should not create new bubbles");
  assert.equal(await page.locator("[data-conversation-message-input]").getAttribute("aria-invalid"), "true", "empty replies should mark the input invalid");
  assert.match(await page.locator("[data-message-empty-reply]").textContent(), /输入|回复|message/i, "empty replies should show useful feedback");
  await page.fill("[data-conversation-message-input]", "下次把路线发我");
  await page.click("[data-conversation-send]");
  await page.waitForFunction(() => document.querySelector("[data-conversation-thread]")?.textContent.includes("下次把路线发我"));

  assert.equal(await page.locator("[data-conversation-message-input]").getAttribute("aria-invalid"), "false", "valid replies should clear invalid state");
  assert.match(await page.locator('[data-conversation-item="lin-che"] [data-conversation-preview]').textContent(), /我：|route-note|涓嬫/, "sent replies should update the conversation preview");
  assert.match(await page.locator("[data-message-thread-state]").textContent(), /已发送|sent/i, "sent replies should update thread delivery state");
  const persistedReply = "route-note-persist-0508";
  await page.fill("[data-conversation-message-input]", persistedReply);
  await page.click("[data-conversation-send]");
  await page.waitForFunction(
    (reply) => document.querySelector("[data-conversation-thread]")?.textContent.includes(reply),
    persistedReply,
  );
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.waitForSelector(".splash.is-hidden");
  await page.click('[data-target="messages"]');
  await page.click('[data-conversation-item="lin-che"]');
  await page.waitForSelector('[data-conversation-thread]:not([hidden])');
  await page.waitForFunction(
    (reply) => document.querySelector("[data-conversation-thread]")?.textContent.includes(reply),
    persistedReply,
  );
  assert.match(
    await page.locator('[data-conversation-item="lin-che"] [data-conversation-preview]').textContent(),
    /route-note-persist-0508/,
    "sent replies should persist in the conversation preview after reload",
  );

  await page.click('[data-target="create"]');
  await page.waitForSelector("[data-create-readiness]");
  assert.match(
    await page.locator(".screen.is-active").evaluate((node) => getComputedStyle(node).getPropertyValue("--screen-bg-image")),
    /bg-create-ink\.png/,
    "create screen should use its generated ink painting background"
  );
  assert.equal(await page.locator("[data-create-draft-state]").count(), 1, "create flow should show draft state");
  assert.match(await page.locator("[data-create-photo-count]").textContent(), /2|照片|photo/i, "create flow should show selected photo count");
  assert.match(await page.locator("[data-create-publish-target]").textContent(), /私密|private/i, "create flow should show current publish target");
  await page.selectOption("[data-create-visibility]", "public");
  assert.match(await page.locator("[data-create-publish-target]").textContent(), /公开|public/i, "publish target should update when visibility changes");

  await page.click('[data-target="profile"]');
  await page.waitForSelector("[data-profile-dashboard]");
  assert.match(
    await page.locator(".screen.is-active").evaluate((node) => getComputedStyle(node).getPropertyValue("--screen-bg-image")),
    /bg-profile-ink\.png/,
    "profile screen should use its generated ink painting background"
  );
  const profileScreenHeight = await page.locator('[data-screen="profile"]').evaluate((node) => node.getBoundingClientRect().height);
  assert.equal(profileScreenHeight >= 800, true, "profile screen should fill the mobile viewport instead of clipping content");
  assert.equal(await page.locator("[data-profile-avatar-image]").count(), 1, "profile should show a real avatar image");
  assert.equal(await page.locator("[data-profile-account-state]").count(), 1, "profile should show account state");
  assert.equal(await page.locator("[data-profile-local-memories]").count(), 1, "profile should show local content stats");
  assert.equal(await page.locator("[data-profile-public-memories]").count(), 1, "profile should show public content stats");
  assert.equal(await page.locator("[data-profile-interactions]").count(), 1, "profile should show interaction stats");
  assert.equal(await page.locator("[data-profile-task-list]").count(), 1, "profile should group normal account tasks");
  assert.equal(await page.locator("[data-profile-task-list] [data-profile-quick-action]").count() >= 4, true, "profile task list should expose useful app actions");
  assert.equal(await page.locator('[data-screen="profile"] [data-profile-edit-panel]').count(), 0, "profile dashboard should not contain the edit form directly");
  await page.click("[data-profile-avatar-edit]");
  await page.waitForSelector('[data-screen="profile-space"].is-active');
  assert.equal(await page.locator("[data-profile-space]").count(), 1, "avatar click should navigate into personal space");
  assert.equal(await page.locator("[data-profile-edit-panel]:not([hidden])").count(), 0, "personal space edit panel should stay closed until edit action");
  await page.click("[data-profile-space-edit]");
  await page.waitForSelector("[data-profile-edit-panel]:not([hidden])");
  assert.equal(await page.locator(".profile-edit-avatar-card").count(), 1, "profile edit should present avatar changes as a designed card");
  assert.equal(await page.locator(".profile-edit-section").count() >= 2, true, "profile edit should group identity and account actions");
  const profileEditColumnCount = await page.locator(".profile-edit-fields").evaluate((node) => getComputedStyle(node).gridTemplateColumns.split(" ").length);
  assert.equal(profileEditColumnCount, 1, "profile edit fields should use one readable column on the mobile surface");
  assert.equal(await page.locator("[data-profile-phone]").count(), 1, "profile edit panel should expose phone editing");
  assert.equal(await page.locator("[data-profile-bio]").count(), 1, "profile edit panel should expose bio editing");
  assert.equal(await page.locator(".file-picker").count(), 1, "cloud upload should use a styled file picker");
  assert.equal(await page.locator(".cloud-danger-action").count(), 1, "photo deletion should use a styled danger action");
  assert.equal(await page.locator(".cloud-account-module").count(), 0, "account identity should move out of the detached cloud module");
  await page.click('[data-target="profile"]');
  assert.equal(await page.locator("[data-profile-primary-action]").count() >= 2, true, "profile should expose practical primary actions");
  assert.equal(await page.locator("[data-profile-quick-action]").count() >= 4, true, "profile should expose useful quick actions");
  assert.equal(await page.locator(".cloud-module").count() >= 2, true, "cloud account area should be split into designed mobile modules");

  assert.deepEqual(consoleErrors, [], "feedback flow should not log console errors");
  assert.deepEqual(failedRequests, [], "feedback flow should not have failed resource requests");
} finally {
  await browser.close();
  await new Promise((resolveClose) => server.close(resolveClose));
  await rm(dataDir, { recursive: true, force: true });
}
