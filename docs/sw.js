// مشواري service worker: keeps the app working with no internet + receives Web Push.
const VERSION = "mishwari-v7";
const SHELL = ["./", "index.html", "manifest.webmanifest", "icon-192.png", "icon-512.png", "icon-maskable-512.png"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  // Google Fonts: cache after first load so the app looks the same offline.
  if (url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com") {
    e.respondWith(caches.open(VERSION).then(async c => {
      const hit = await c.match(req);
      if (hit) return hit;
      const res = await fetch(req);
      c.put(req, res.clone());
      return res;
    }));
    return;
  }

  if (url.origin !== location.origin) return;

  // App files: network first (so updates arrive), cache when offline.
  e.respondWith(
    fetch(req).then(res => {
      const copy = res.clone();
      caches.open(VERSION).then(c => c.put(req, copy));
      return res;
    }).catch(() => caches.match(req).then(r => r || caches.match("index.html")))
  );
});

/* ================= Web Push ================= */
self.addEventListener("push", e => {
  let data = {};
  if (e.data) {
    try { data = e.data.json(); }
    catch (_) { data = { body: e.data.text() }; }
  }
  const title = data.title || "مشواري";
  const options = {
    body: data.body || "",
    icon: "icon-192.png",
    badge: "icon-192.png",
    tag: data.tag || "mishwari",
    renotify: !!data.tag,
    dir: "rtl",
    lang: "ar",
    vibrate: [120, 60, 120],
    data: data.data || { url: "./" },
    actions: [{ action: "open", title: "افتح" }, { action: "later", title: "بعدين" }]
  };
  e.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", e => {
  e.notification.close();
  const url = (e.notification.data && e.notification.data.url) || "./";
  e.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(list => {
      for (const c of list) {
        if (c.url.startsWith(self.location.origin)) {
          c.postMessage({ type: "notification-click", url, date: (e.notification.data && e.notification.data.date) || null });
          return c.focus();
        }
      }
      return self.clients.openWindow(url);
    })
  );
});

self.addEventListener("notificationclose", e => {
  e.waitUntil(Promise.resolve());
});
