const CACHE_NAME = "chatbot-cache-v1";

// Add the files you want to cache
const urlsToCache = [
  "/",
  "/manifest.json",
  "/images/support.png",
  "/images/ron_jay.png",
  "/images/NFTREASURE.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches
      .match(event.request)
      .then((response) => response || fetch(event.request))
  );
});
