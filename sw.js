const CACHE='daily-move-pages-v2';
const ASSETS=['./','./entry.js','./entry.css','./fanfare.mp3','./favicon.svg','./icon-192.png','./icon-512.png','./manifest.webmanifest'].map(p=>new URL(p,self.registration.scope).href);
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)));self.skipWaiting()});
self.addEventListener('activate',event=>{event.waitUntil(self.clients.claim())});
self.addEventListener('fetch',event=>{if(event.request.method!=='GET'||!ASSETS.includes(event.request.url))return;event.respondWith(fetch(event.request).then(response=>{if(response.ok){const copy=response.clone();event.waitUntil(caches.open(CACHE).then(cache=>cache.put(event.request,copy)))}return response}).catch(()=>caches.match(event.request).then(cached=>cached||Response.error()))) });
