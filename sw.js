// Makes repeat visits fast by keeping the site's files on the visitor's device.
// Pages always come fresh from the network, so a new deploy shows up straight away.
// Files with a ?v= version never change, so the saved copy is safe; a new version has a new address.
// Images and fonts show the saved copy at once and refresh it in the background.
const CACHE = 'portfolio-v1';

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((names) => Promise.all(names.filter((n) => n !== CACHE).map((n) => caches.delete(n))))
      .then(() => self.clients.claim())
  );
});

async function save(cache, request, response) {
  if (!response || !response.ok || response.type !== 'basic') return;
  const url = new URL(request.url);
  if (url.search) {
    const old = await cache.keys();
    await Promise.all(old.filter((k) => {
      const u = new URL(k.url);
      return u.pathname === url.pathname && u.search !== url.search;
    }).map((k) => cache.delete(k)));
  }
  await cache.put(request, response);
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin) return;
  if (request.headers.has('range') || /\.(mp4|pdf|xlsx)$/.test(url.pathname)) return;

  if (request.mode === 'navigate') {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE);
      try {
        const fresh = await fetch(request);
        await save(cache, new Request(url.origin + url.pathname), fresh.clone());
        return fresh;
      } catch (e) {
        return (await cache.match(url.origin + url.pathname)) || Response.error();
      }
    })());
    return;
  }

  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const saved = await cache.match(request);
    if (saved && url.searchParams.has('v')) return saved;
    const fresh = fetch(request).then(async (response) => {
      await save(cache, request, response.clone());
      return response;
    });
    if (saved) {
      event.waitUntil(fresh.catch(() => {}));
      return saved;
    }
    return fresh;
  })());
});
