/* eslint-disable no-undef */
// Placeholder service worker for Firebase Messaging. Actual logic can be added if needed.
self.addEventListener('push', function(event) {
  // Keep minimal to avoid errors; app handles UI refresh via SignalR/FCM in page context
  event.waitUntil(Promise.resolve());
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(clients.matchAll({ type: 'window' }).then(function(clientList) {
    for (const client of clientList) {
      if ('focus' in client) return client.focus();
    }
    if (clients.openWindow) return clients.openWindow('/notifications');
  }));
});
