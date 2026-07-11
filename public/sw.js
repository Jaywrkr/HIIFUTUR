const CACHE = "ejecuta-shell-v1";
const OFFLINE_URL = "/offline.html";

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll([OFFLINE_URL])));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Network-first navigation, offline fallback only. No caching of app data —
// habits and progress must always come from the server, never stale.
self.addEventListener("fetch", (event) => {
  if (event.request.mode === "navigate") {
    event.respondWith(fetch(event.request).catch(() => caches.match(OFFLINE_URL)));
  }
});

// Daily reminder push. Payload is JSON: { title, body, url, habitId }.
// habitId is only present for the anchor-habit reminder, and is what makes
// the "Marcar hecho" action possible below.
self.addEventListener("push", (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch {
    data = {};
  }

  const title = data.title || "EJECUTA";
  event.waitUntil(
    self.registration.showNotification(title, {
      body: data.body || "",
      icon: "/icon-192.png",
      badge: "/icon-192.png",
      data: { url: data.url || "/dashboard", habitId: data.habitId },
      actions: data.habitId ? [{ action: "check", title: "Marcar hecho" }] : [],
    })
  );
});

// Tapping the "Marcar hecho" action checks the habit off directly — zero
// taps inside the app. Tapping the notification body itself just opens (or
// focuses) the app, same as before.
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const { url, habitId } = event.notification.data || {};
  const target = url || "/dashboard";

  async function focusOrOpen() {
    const clientList = await clients.matchAll({ type: "window", includeUncontrolled: true });
    for (const client of clientList) {
      if ("focus" in client) return client.focus();
    }
    if (clients.openWindow) return clients.openWindow(target);
  }

  if (event.action === "check" && habitId) {
    event.waitUntil(
      fetch(`/api/habits/${habitId}/check`, { method: "POST" }).finally(focusOrOpen)
    );
    return;
  }

  event.waitUntil(focusOrOpen());
});
