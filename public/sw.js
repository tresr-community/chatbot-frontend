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
  "/images/pwa/apple-splash-1125-2436.png",
  "/images/pwa/apple-splash-1136-640.png",
  "/images/pwa/apple-splash-1170-2532.png",
  "/images/pwa/apple-splash-1179-2556.png",
  "/images/pwa/apple-splash-1206-2622.png",
  "/images/pwa/apple-splash-1242-2208.png",
  "/images/pwa/apple-splash-1242-2688.png",
  "/images/pwa/apple-splash-1284-2778.png",
  "/images/pwa/apple-splash-1290-2796.png",
  "/images/pwa/apple-splash-1320-2868.png",
  "/images/pwa/apple-splash-1334-750.png",
  "/images/pwa/apple-splash-1488-2266.png",
  "/images/pwa/apple-splash-1536-2048.png",
  "/images/pwa/apple-splash-1620-2160.png",
  "/images/pwa/apple-splash-1640-2360.png",
  "/images/pwa/apple-splash-1668-2224.png",
  "/images/pwa/apple-splash-1668-2388.png",
  "/images/pwa/apple-splash-1792-828.png",
  "/images/pwa/apple-splash-2048-1536.png",
  "/images/pwa/apple-splash-2048-2732.png",
  "/images/pwa/apple-splash-2160-1620.png",
  "/images/pwa/apple-splash-2208-1242.png",
  "/images/pwa/apple-splash-2224-1668.png",
  "/images/pwa/apple-splash-2266-1488.png",
  "/images/pwa/apple-splash-2360-1640.png",
  "/images/pwa/apple-splash-2388-1668.png",
  "/images/pwa/apple-splash-2436-1125.png",
  "/images/pwa/apple-splash-2532-1170.png",
  "/images/pwa/apple-splash-2556-1179.png",
  "/images/pwa/apple-splash-2622-1206.png",
  "/images/pwa/apple-splash-2688-1242.png",
  "/images/pwa/apple-splash-2732-2048.png",
  "/images/pwa/apple-splash-2778-1284.png",
  "/images/pwa/apple-splash-2796-1290.png",
  "/images/pwa/apple-splash-2868-1320.png",
  "/images/pwa/apple-splash-640-1136.png",
  "/images/pwa/apple-splash-750-1334.png",
  "/images/pwa/apple-splash-828-1792.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return Promise.all(
        urlsToCache.map((url) => {
          return fetch(url)
            .then((response) => {
              if (!response.ok) {
                throw new Error(
                  `Failed to fetch ${url}: ${response.statusText}`
                );
              }
              return cache.put(url, response);
            })
            .catch((error) => {
              console.error(`Failed to cache ${url}:`, error);
            });
        })
      );
    })
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

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // Exclude API requests and chrome extensions from caching
  if (
    event.request.method !== "GET" ||
    url.pathname.startsWith("/api/") ||
    url.protocol.startsWith("chrome-extension")
  ) {
    return;
  }

  // Handle Navigation Requests (HTML pages)
  // Network First, Fallback to Cache
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // If we got a valid response, clone and cache it
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
          return response;
        })
        .catch(() => {
          // If network fails, try to return the cached page
          return caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            // If the specific page isn't cached, return a boiler plate response.
            return new Response("You are offline.", {
              status: 503,
              statusText: "Service Unavailable",
            });
          });
        })
    );
    return;
  }

  // Handle Static Assets (Images, CSS, JS)
  // Stale-While-Revalidate: Return cache immediately, then update cache in background
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, networkResponse.clone());
        });
        return networkResponse;
      });

      // Return cached response if available, otherwise wait for network
      return cachedResponse || fetchPromise;
    })
  );
});
