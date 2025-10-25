// This is the Service Worker file

const CACHE_NAME = 'astro-cadet-v1';
// This list includes all the files your game needs to run.
const FILES_TO_CACHE = [
    '/', // This caches the root directory (your index.html)
    'index.html',
    'style.css',
    'game.js',
    'gamedata.json'
    // If you add any images or sounds, add their paths here too!
    // e.g., 'images/isro_logo.png'
];

// 1. Install Event: Cache all the files
// This runs once when the service worker is first installed.
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Service Worker: Caching all files...');
                return cache.addAll(FILES_TO_CACHE);
            })
    );
});

// 2. Fetch Event: Serve from cache
// This runs every time the browser tries to fetch a file (like index.html, game.js, etc.)
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                if (response) {
                    // If we found a match in the cache, return it.
                    console.log('Service Worker: Serving from cache:', event.request.url);
                    return response;
                }
                // If not in cache, try to fetch it from the internet.
                console.log('Service Worker: Fetching from network:', event.request.url);
                return fetch(event.request);
            })
    );
});

// 3. Activate Event: Clean up old caches (optional but good practice)
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});