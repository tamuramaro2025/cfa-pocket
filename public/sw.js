/* A consistent version of the complete app. Study records stay in device storage. */
importScripts('./precache-manifest.js');
const CACHE_PREFIX = 'cfa-pocket-assets-';
const CACHE = CACHE_PREFIX + self.CFA_CACHE_VERSION;
const ASSETS = new Set(self.CFA_PRECACHE);
const BASE = self.location.pathname ? self.location.pathname.replace(/\/[^/]*$/, '') : '';
self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    try {
      const responses = await Promise.all([...ASSETS].map(async url => {
        const fetchUrl = BASE ? BASE + url : url;
        const response = await fetch(new Request(fetchUrl, { cache: 'reload', credentials: 'same-origin' }));
        if (!response.ok || response.redirected) throw new Error(`Cannot cache ${url}`);
        if (url.endsWith('.js') && !/javascript/i.test(response.headers.get('content-type') || '')) throw new Error(`Unexpected script: ${url}`);
        return [url, response];
      }));
      for (const [url, response] of responses) await cache.put(url, response);
    } catch (error) { await caches.delete(CACHE); throw error; }
    // Do not replace the active version during a study session.
  })());
});
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    for (const key of await caches.keys()) if (key.startsWith(CACHE_PREFIX) && key !== CACHE) await caches.delete(key);
    await self.clients.claim();
  })());
});
self.addEventListener('message', event => {
  if (event.data?.type === 'ACTIVATE_UPDATE') self.skipWaiting();
  if (event.data?.type === 'OFFLINE_STATUS' && event.ports?.[0]) event.waitUntil((async()=>{
    const cache=await caches.open(CACHE);
    const ready=(await Promise.all([...ASSETS].map(url=>cache.match(url)))).every(Boolean);
    event.ports[0].postMessage({ready});
  })());
});
self.addEventListener('fetch', event => {
  const request=event.request; const url=new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin) return;
  if (BASE && url.pathname !== BASE && !url.pathname.startsWith(BASE + '/')) return;
  const relPath = BASE ? (url.pathname.slice(BASE.length) || '/') : url.pathname;
  if (!ASSETS.has(relPath)) return;
  event.respondWith((async () => {
    const response=await (await caches.open(CACHE)).match(relPath);
    if (response) return response;
    try { return await fetch(request); }
    catch { return new Response('オフライン教材が見つかりません。接続してもう一度開いてください。', {status:503,headers:{'Content-Type':'text/plain; charset=utf-8'}}); }
  })());
});
