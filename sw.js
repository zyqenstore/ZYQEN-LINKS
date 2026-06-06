const CACHE_NAME = "zyqen-cache-v3";

const FILES_TO_CACHE = [
  "./",
  "./index.html",
  "./admin.html",
  "./dashboard.html",
  "./style.css",
  "./script.js",
  "./manifest.json",
  "./manifest-admin.json",
  "./Icones/Image/Zroxo.png",
  "./Icones/Image/Z.png",
  "./Icones/Icon/link.svg",
  "./Icones/Icon/instagram.svg",
  "./Icones/Icon/mail.svg",
  "./Icones/Icon/badge-check.svg",
  "./Icones/Icon/download.svg"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});