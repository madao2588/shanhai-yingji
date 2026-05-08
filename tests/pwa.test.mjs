import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const html = readFileSync("index.html", "utf8");
const manifestPath = "manifest.webmanifest";
const serviceWorkerPath = "service-worker.js";
const pwaRegisterPath = "src/pwa-register.js";

assert.equal(existsSync(manifestPath), true, "PWA manifest should exist");
assert.equal(existsSync(serviceWorkerPath), true, "service worker should exist");
assert.equal(existsSync(pwaRegisterPath), true, "PWA registration script should exist");

const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
const serviceWorker = readFileSync(serviceWorkerPath, "utf8");
const pwaRegister = readFileSync(pwaRegisterPath, "utf8");

assert.match(html, /<link rel="manifest" href="manifest\.webmanifest" \/>/, "index should link the manifest");
assert.match(html, /<meta name="theme-color" content="#0a1214" \/>/, "index should expose a mobile theme color");
assert.match(html, /<script src="src\/pwa-register\.js\?v=profile-message-polish-1"><\/script>/, "index should load the external PWA registration script");
assert.match(pwaRegister, /navigator\.serviceWorker\.register\("service-worker\.js"\)/, "PWA script should register the service worker");
assert.match(pwaRegister, /window\.location\.protocol\.startsWith\("http"\)/, "service worker registration should preserve direct file-open support");

assert.equal(manifest.name, "山海映记", "manifest should use the product name");
assert.equal(manifest.display, "standalone", "manifest should enable standalone display");
assert.equal(manifest.start_url, "./index.html", "manifest should start at the static app entry");
assert.equal(manifest.icons[0].src, "assets/app-icon.svg", "manifest should use the existing app icon");

assert.match(serviceWorker, /const cacheName = "shanhai-yingji-v7"/, "service worker should version its cache");
assert.match(serviceWorker, /"\.\/assets\/avatar-lin-che\.svg"/, "service worker should cache the profile avatar");
assert.match(serviceWorker, /"\.\/src\/main\.js\?v=profile-message-polish-1"/, "service worker should cache the app entry");
assert.match(serviceWorker, /"\.\/src\/storage\/archive-export\.js\?v=profile-message-polish-1"/, "service worker should cache archive transfer helpers");
assert.match(serviceWorker, /"\.\/src\/pwa-register\.js\?v=profile-message-polish-1"/, "service worker should cache PWA registration");
assert.match(serviceWorker, /caches\.match\("\.\/index\.html"\)/, "service worker should fall back to the static entry for navigation");
