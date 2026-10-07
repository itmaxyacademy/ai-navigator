const CACHE_NAME = 'ai-navigator-shell-v2';
const PRECACHE_URLS = [
  '/app/',
  '/app/index.html',
  '/app/manifest.json',
  '/app/favicon.ico',
  '/app/favicon-32x32.png',
  '/app/icon-192.png',
  '/app/icon-512.png',
  '/app/maxy-navigator.png'
];

// Install: Cache core app shell and activate immediately
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_URLS).catch((err) => {
        console.warn('PWA Precache warning:', err);
      });
    })
  );
});

// Activate: Clean up old cache versions and claim clients
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: Network-first for navigate requests, Cache fallback for offline resilience
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Bypass non-GET requests and external analytics or API services
  if (request.method !== 'GET') return;
  if (!url.origin.includes(self.location.origin)) return;

  // Handle SPA HTML navigations: Network-first -> fallback to /app/index.html
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(async () => {
        const cache = await caches.open(CACHE_NAME);
        return (await cache.match('/app/index.html')) || (await cache.match('/app/'));
      })
    );
    return;
  }

  // Handle static assets (JS, CSS, images, fonts): Cache-first with background network revalidate
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const fetchPromise = fetch(request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => cachedResponse);

      return cachedResponse || fetchPromise;
    })
  );
});
