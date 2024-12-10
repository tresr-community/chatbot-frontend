const CACHE_NAME = "chatbot-cache-v1";

const urlsToCache = [
  "/",
  "/manifest.json",
  "/fullscreen",
  "/images/user.png",
  "/images/support.png",
  "/images/pwa/manifest-icon-192.maskable.png",
  "/images/pwa/manifest-icon-512.maskable.png",
  "/images/pwa/apple-icon-180.png",
  "/images/pwa/apple-splash-1125-2436.jpg",
  "/images/pwa/apple-splash-1136-640.jpg",
  "/images/pwa/apple-splash-1170-2532.jpg",
  "/images/pwa/apple-splash-1179-2556.jpg",
  "/images/pwa/apple-splash-1206-2622.jpg",
  "/images/pwa/apple-splash-1242-2208.jpg",
  "/images/pwa/apple-splash-1242-2688.jpg",
  "/images/pwa/apple-splash-1284-2778.jpg",
  "/images/pwa/apple-splash-1290-2796.jpg",
  "/images/pwa/apple-splash-1320-2868.jpg",
  "/images/pwa/apple-splash-1334-750.jpg",
  "/images/pwa/apple-splash-1488-2266.jpg",
  "/images/pwa/apple-splash-1536-2048.jpg",
  "/images/pwa/apple-splash-1620-2160.jpg",
  "/images/pwa/apple-splash-1640-2360.jpg",
  "/images/pwa/apple-splash-1668-2224.jpg",
  "/images/pwa/apple-splash-1668-2388.jpg",
  "/images/pwa/apple-splash-1792-828.jpg",
  "/images/pwa/apple-splash-2048-1536.jpg",
  "/images/pwa/apple-splash-2048-2732.jpg",
  "/images/pwa/apple-splash-2160-1620.jpg",
  "/images/pwa/apple-splash-2208-1242.jpg",
  "/images/pwa/apple-splash-2224-1668.jpg",
  "/images/pwa/apple-splash-2266-1488.jpg",
  "/images/pwa/apple-splash-2360-1640.jpg",
  "/images/pwa/apple-splash-2388-1668.jpg",
  "/images/pwa/apple-splash-2436-1125.jpg",
  "/images/pwa/apple-splash-2532-1170.jpg",
  "/images/pwa/apple-splash-2556-1179.jpg",
  "/images/pwa/apple-splash-2622-1206.jpg",
  "/images/pwa/apple-splash-2688-1242.jpg",
  "/images/pwa/apple-splash-2732-2048.jpg",
  "/images/pwa/apple-splash-2778-1284.jpg",
  "/images/pwa/apple-splash-2796-1290.jpg",
  "/images/pwa/apple-splash-2868-1320.jpg",
  "/images/pwa/apple-splash-640-1136.jpg",
  "/images/pwa/apple-splash-750-1334.jpg",
  "/images/pwa/apple-splash-828-1792.jpg",
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
