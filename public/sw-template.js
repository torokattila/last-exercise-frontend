/* eslint-env serviceworker */
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

firebase.initializeApp(__FIREBASE_CONFIG__);

const messaging = firebase.messaging();

// Handle FCM push notifications when the app is in the background
messaging.onBackgroundMessage((payload) => {
  const title = payload.notification?.title ?? 'Exercise reminder!';
  const iconUrl = self.location.origin + '/workout.png';
  const options = {
    body: payload.notification?.body ?? "Time to exercise!",
    icon: payload.notification?.icon ?? iconUrl,
    badge: iconUrl,
    tag: 'interval-timer',
    renotify: true,
    silent: false,
  };
  self.registration.showNotification(title, options);
});

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()));

self.addEventListener('message', (event) => {
  if (event.data?.type === 'INTERVAL_NOTIFICATION') {
    const iconUrl = self.location.origin + '/workout.png';
    self.registration.showNotification(event.data.title ?? 'Interval reached!', {
      body: event.data.body ?? "Time's up! Keep it up 💪",
      icon: iconUrl,
      badge: iconUrl,
      tag: 'interval-timer',
      renotify: true,
      silent: false,
    });
  }
});
