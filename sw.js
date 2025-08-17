// GetMoney+ Service Worker

const CACHE_NAME = 'getmoneyplus-v1';
const ASSETS_TO_CACHE = [
    '/',
    '/login.html',
    '/signup.html',
    '/home.html',
    '/invest.html',
    '/recommend.html',
    '/team.html',
    '/user.html',
    '/assets/css/variables.css',
    '/assets/css/main.css',
    '/assets/css/auth.css',
    '/assets/css/components.css',
    '/assets/js/auth.js',
    '/assets/js/app.js',
    '/assets/js/database.js',
    '/assets/svg/favicon.svg',
    '/assets/svg/icon-192x192.svg',
    '/assets/svg/icon-512x512.svg',
    '/manifest.json'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Cache opened');
                return cache.addAll(ASSETS_TO_CACHE);
            })
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Return cached response if found
                if (response) {
                    return response;
                }
                // Clone the request for the fetch
                const fetchRequest = event.request.clone();
                // Make network request
                return fetch(fetchRequest)
                    .then((response) => {
                        // Check if valid response
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }
                        // Clone the response
                        const responseToCache = response.clone();
                        // Cache the response
                        caches.open(CACHE_NAME)
                            .then((cache) => {
                                cache.put(event.request, responseToCache);
                            });
                        return response;
                    })
                    .catch(() => {
                        // Return offline fallback if fetch fails
                        return new Response('Offline content not available');
                    });
            })
    );
});
