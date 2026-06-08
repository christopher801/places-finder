/**
 * PlacesFinder Service Worker
 * Strategy:
 *  - App Shell  → Cache First (HTML, JS, CSS, fonts)
 *  - Images     → Cache First with network fallback
 *  - API calls  → Network First with cache fallback
 *  - Nominatim / Overpass → Network Only (real-time data)
 */

const CACHE_NAME    = 'placesfinder-v1';
const RUNTIME_CACHE = 'placesfinder-runtime-v1';

// Files to pre-cache on install (app shell)
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
];

// ── Install ────────────────────────────────────────────────
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// ── Activate ───────────────────────────────────────────────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(k => k !== CACHE_NAME && k !== RUNTIME_CACHE)
          .map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

// ── Fetch ──────────────────────────────────────────────────
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET & browser-extension requests
  if (request.method !== 'GET') return;
  if (!url.protocol.startsWith('http')) return;

  // ── Nominatim / Overpass: Network Only (fresh map data) ──
  if (
    url.hostname.includes('nominatim.openstreetmap.org') ||
    url.hostname.includes('overpass-api.de') ||
    url.hostname.includes('overpass.kumi.systems') ||
    url.hostname.includes('mail.ru')
  ) {
    return; // browser handles it natively
  }

  // ── Firebase / Firestore: Network Only ───────────────────
  if (
    url.hostname.includes('firestore.googleapis.com') ||
    url.hostname.includes('identitytoolkit.googleapis.com') ||
    url.hostname.includes('securetoken.googleapis.com')
  ) {
    return;
  }

  // ── Google Fonts: Cache First ─────────────────────────────
  if (url.hostname.includes('fonts.googleapis.com') || url.hostname.includes('fonts.gstatic.com')) {
    event.respondWith(
      caches.open(RUNTIME_CACHE).then(cache =>
        cache.match(request).then(cached =>
          cached || fetch(request).then(res => {
            cache.put(request, res.clone());
            return res;
          })
        )
      )
    );
    return;
  }

  // ── OSM Tile Images: Cache First ──────────────────────────
  if (url.hostname.includes('tile.openstreetmap.org')) {
    event.respondWith(
      caches.open(RUNTIME_CACHE).then(cache =>
        cache.match(request).then(cached =>
          cached || fetch(request).then(res => {
            if (res.ok) cache.put(request, res.clone());
            return res;
          }).catch(() => cached)
        )
      )
    );
    return;
  }

  // ── App Shell (HTML / JS / CSS): Cache First ──────────────
  if (
    request.destination === 'document' ||
    request.destination === 'script' ||
    request.destination === 'style' ||
    request.destination === 'font' ||
    request.destination === 'image'
  ) {
    event.respondWith(
      caches.match(request).then(cached => {
        const network = fetch(request).then(res => {
          if (res.ok) {
            caches.open(RUNTIME_CACHE).then(c => c.put(request, res.clone()));
          }
          return res;
        });
        return cached || network;
      })
    );
    return;
  }
});

// ── Background Sync placeholder ────────────────────────────
self.addEventListener('message', event => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});