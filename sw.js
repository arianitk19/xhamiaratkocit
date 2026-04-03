const CACHE_NAME = 'xhamia-ratkoc-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/kibla.html',
  '/njoftimet.html',
  'https://cdn.tailwindcss.com',
  'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js',
  'https://cdn.jsdelivr.net/npm/remixicon@3.5.0/fonts/remixicon.css'
];

// 1. Instalimi: Ruajtja e skedarëve për punë offline
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Duke ruajtur skedarët në cache...');
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting(); // Aktivizohet menjëherë
});

// 2. Aktivizimi: Merr kontrollin e të gjitha faqeve menjëherë
self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

// 3. Strategjia Offline: Shërbe skedarët nga cache nëse nuk ka internet
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

// 4. Njoftimet (Push Notifications)
self.addEventListener('push', (event) => {
  let data = { title: 'Xhamia e Ratkocit', body: 'Koha e namazit!' };
  
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body,
    icon: 'https://cdn-icons-png.flaticon.com/512/2950/2950657.png',
    badge: 'https://cdn-icons-png.flaticon.com/512/2950/2950657.png',
    vibrate: [200, 100, 200],
    data: { dateOfArrival: Date.now() },
    actions: [
      { action: 'open', title: 'Hap App-in' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// 5. Klikimi i njoftimit: Hap faqen kryesore
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      // Nëse aplikacioni është i hapur, bëji fokus
      for (let client of windowClients) {
        if (client.url.includes('/') && 'focus' in client) {
          return client.focus();
        }
      }
      // Nëse është i mbyllur, hape të ri
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});
