const CACHE = 'eldorado-v3';
const BASE = new URL('./', self.registration.scope);
const ASSETS = [
  'index.html',
  'manifest.json',
  'manifest.webmanifest',
  'index - 2026-09-29T111512.576.html',
  'icons/billzen-192.png',
  'icons/billzen-512.png',
  'icons/apple-touch-icon.png'
].map(path => new URL(path, BASE).href);

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  if(e.request.method !== 'GET' || new URL(e.request.url).origin !== self.location.origin) return;
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request).catch(() => caches.match('/eldoradohub/index.html')))
  );
});
