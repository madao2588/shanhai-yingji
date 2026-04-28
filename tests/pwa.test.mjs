import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const html = readFileSync("index.html", "utf8");
const manifestPath = "manifest.webmanifest";
const serviceWorkerPath = "service-worker.js";

assert.equal(existsSync(manifestPath), true, "PWA manifest should exist");
assert.equal(existsSync(serviceWorkerPath), true, "service worker should exist");

const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
const serviceWorker = readFileSync(serviceWorkerPath, "utf8");

assert.match(html, /<link rel="manifest" href="manifest\.webmanifest" \/>/, "index should link the manifest");
assert.match(html, /<meta name="theme-color" content="#0a1214" \/>/, "index should expose a mobile theme color");
assert.match(html, /navigator\.serviceWorker\.register\("service-worker\.js"\)/, "index should register the service worker");
assert.match(html, /window\.location\.protocol\.startsWith\("http"\)/, "service worker registration should preserve direct file-open support");

assert.equal(manifest.name, "山海映记", "manifest should use the product name");
assert.equal(manifest.display, "standalone", "manifest should enable standalone display");
assert.equal(manifest.start_url, "./index.html", "manifest should start at the static app entry");
assert.equal(manifest.icons[0].src, "assets/app-icon.svg", "manifest should use the existing app icon");

assert.match(serviceWorker, /const cacheName = "shanhai-yingji-v1"/, "service worker should version its cache");
assert.match(serviceWorker, /"\.\/src\/main\.js"/, "service worker should cache the app entry");
assert.match(serviceWorker, /"\.\/src\/storage\/archive-export\.js"/, "service worker should cache archive transfer helpers");
assert.match(serviceWorker, /caches\.match\("\.\/index\.html"\)/, "service worker should fall back to the static entry for navigation");
