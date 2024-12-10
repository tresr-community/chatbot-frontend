const CACHE_NAME = "chatbot-cache-v1";

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

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    (async () => {
      const cachedResponse = await caches.match(event.request);

      // Return cached version if available, but fetch from network in background
      const networkFetch = fetch(event.request).then((response) => {
        // Update the cache with the fresh version
        const cacheClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, cacheClone);
        });
        return response;
      });

      // Immediately return cached version if available
      return cachedResponse || networkFetch;
    })()
  );
});
