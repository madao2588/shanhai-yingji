const cacheName = "shanhai-yingji-v1";
const coreAssets = [
  "./",
  "./index.html",
  "./styles.css",
  "./manifest.webmanifest",
  "./assets/app-icon.svg",
  "./src/data/seed-destinations.js",
  "./src/data/seed-memories.js",
  "./src/domain/memory.js",
  "./src/storage/local-store.js",
  "./src/storage/archive-export.js",
  "./src/main.js",
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(cacheName).then((cache) => cache.addAll(coreAssets)));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== cacheName).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      return (
        cached ||
        fetch(event.request).catch(() => {
          if (event.request.mode === "navigate") {
            return caches.match("./index.html");
          }

          return undefined;
        })
      );
    }),
  );
});
