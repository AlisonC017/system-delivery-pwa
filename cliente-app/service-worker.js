/**
 * Service worker de la PWA (pedidos-cliente).
 * - Habilita la instalación (manifest + service worker + HTTPS de Netlify).
 * - Estrategia "network first": siempre intenta la red y solo usa la copia
 *   guardada si falla. Así nunca se muestra código viejo tras un deploy.
 * - Las peticiones a Firebase/Firestore (otros dominios) NO se interceptan:
 *   los datos y el tiempo real siempre vienen directo de Firebase.
 * - Muestra notificaciones y enfoca la app al tocarlas.
 */
const CACHE = "pedidos-cliente-v1";
const APP_SHELL = ["./", "./index.html", "./manifest.json", "./icons/icon-192.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(APP_SHELL)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  const url = new URL(req.url);
  if (req.method !== "GET" || url.origin !== self.location.origin) return;

  event.respondWith(
    fetch(req)
      .then((res) => {
        if (res.ok) {
          const copia = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copia));
        }
        return res;
      })
      .catch(() => caches.match(req).then((r) => r || caches.match("./index.html")))
  );
});

// Al tocar una notificación: enfocar la app abierta o abrirla.
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((ventanas) => {
      for (const v of ventanas) {
        if ("focus" in v) return v.focus();
      }
      return self.clients.openWindow("./index.html");
    })
  );
});
