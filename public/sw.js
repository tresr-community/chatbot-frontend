const CACHE_NAME = "chatbot-cache-v1";

const urlsToCache = [
  "/",
  "/manifest.json",
  "/fullscreen",
  "/images/user.png",
  "/images/support.png",
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
  if (event.request.url.startsWith("chrome-extension://")) {
    return;
  }

  if (event.request.mode === "navigate") {
    return event.respondWith(fetch(event.request));
  } else {
    event.respondWith(
      (async () => {
        const cachedResponse = await caches.match(event.request);
        const networkFetch = fetch(event.request).then((response) => {
          const cacheClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, cacheClone);
          });
          return response;
        });
        return cachedResponse || networkFetch;
      })()
    );
  }
});
