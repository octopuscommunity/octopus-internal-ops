const CACHE_NAME = "octopus-ops-shell-v1";
const SHELL_FILES = ["./index.html", "./manifest.json", "./icon-192.png", "./icon-512.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL_FILES)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  // أي طلب بيانات حقيقي من Supabase يفضل دايمًا يروح للإنترنت مباشرة، عشان البيانات تكون لايف
  if (event.request.url.includes("supabase.co")) return;
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
