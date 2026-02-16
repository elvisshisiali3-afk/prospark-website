/**
 * PROSPARK CLEANING HUB - SERVICE WORKER
 * Progressive Web App (PWA) Support & Offline Functionality
 */

const CACHE_NAME = 'prospark-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/login.html',
  '/booking.html',
  '/dashboard.html',
  '/profile.html',
  '/admin.html',
  '/css/main.css',
  '/js/app.js',
  '/js/auth.js',
  '/js/booking.js',
  '/js/dashboard.js',
  '/js/admin.js',
  '/manifest.json'
];

// Install event - cache resources
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache).catch(err => {
        console.log('Cache addAll error:', err);
        // Don't fail the install if some resources fail to cache
        return Promise.resolve();
      });
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request).then(response => {
      // Return cached version if available
      if (response) {
        return response;
      }

      // Try to fetch from network
      return fetch(event.request).then(response => {
        // Don't cache non-successful responses
        if (!response || response.status !== 200 || response.type === 'error') {
          return response;
        }

        // Clone the response
        const responseToCache = response.clone();

        // Cache the new request
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseToCache);
        });

        return response;
      }).catch(err => {
        // Offline fallback
        console.log('Fetch failed; returning offline response:', err);
        return new Response('You are offline. Some features may be limited.', {
          status: 503,
          statusText: 'Service Unavailable',
          headers: new Headers({
            'Content-Type': 'text/plain'
          })
        });
      });
    })
  );
});

// Handle messages from clients
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Background sync (PWA feature)
self.addEventListener('sync', event => {
  if (event.tag === 'sync-bookings') {
    event.waitUntil(syncBookings());
  }
});

/**
 * Sync bookings when back online
 */
async function syncBookings() {
  try {
    const bookings = localStorage.getItem('prospark_bookings_pending');
    if (bookings) {
      // Attempt to sync with server (when backend is ready)
      // For now, just clear the flag
      localStorage.removeItem('prospark_bookings_pending');
    }
  } catch (error) {
    console.log('Sync failed:', error);
    throw error;
  }
}

// Periodic sync (if supported)
self.addEventListener('periodicsync', event => {
  if (event.tag === 'check-updates') {
    event.waitUntil(checkForUpdates());
  }
});

/**
 * Check for app updates
 */
async function checkForUpdates() {
  try {
    const response = await fetch('/version.json');
    if (response.ok) {
      const data = await response.json();
      // Notify client of update availability
      const clients = await self.clients.matchAll();
      clients.forEach(client => {
        client.postMessage({
          type: 'UPDATE_AVAILABLE',
          version: data.version
        });
      });
    }
  } catch (error) {
    console.log('Update check failed:', error);
  }
}

// Push notification handling
self.addEventListener('push', event => {
  let notificationData = {
    title: 'ProSpark Cleaning Hub',
    body: 'New notification',
    icon: '/icon.svg',
    tag: 'prospark-notification'
  };

  if (event.data) {
    notificationData = event.data.json();
  }

  event.waitUntil(
    self.registration.showNotification(notificationData.title, notificationData)
  );
});

// Notification click handling
self.addEventListener('notificationclick', event => {
  event.notification.close();

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      // Check if there's already a window open
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if (client.url === '/' && 'focus' in client) {
          return client.focus();
        }
      }

      // If not, open a new window
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});
