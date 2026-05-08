const cacheName = "shanhai-yingji-v9";
const coreAssets = [
  "./",
  "./index.html",
  "./styles.css?v=direct-message-1",
  "./manifest.webmanifest",
  "./assets/app-icon.svg",
  "./assets/avatar-lin-che.svg",
  "./assets/photo-kyoto-temple.svg",
  "./assets/photo-kyoto-street.svg",
  "./assets/photo-iceland-mountain.svg",
  "./assets/photo-iceland-coast.svg",
  "./assets/photo-paris.svg",
  "./assets/photo-desert-city.svg",
  "./assets/photo-alpine.svg",
  "./assets/photo-ocean.svg",
  "./src/data/seed-destinations.js?v=direct-message-1",
  "./src/data/seed-memories.js?v=direct-message-1",
  "./src/domain/memory.js?v=direct-message-1",
  "./src/storage/local-store.js?v=direct-message-1",
  "./src/storage/archive-export.js?v=direct-message-1",
  "./src/api-client.js?v=direct-message-1",
  "./src/main.js?v=direct-message-1",
  "./src/fullstack-panel.js?v=direct-message-1",
  "./src/pwa-register.js?v=direct-message-1",
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
