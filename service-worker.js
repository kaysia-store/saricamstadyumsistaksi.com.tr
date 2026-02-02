const CACHE_NAME = 'sis-taksi-v1';
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/styles.css',
    '/script.js',
    '/favicon.svg',
    '/walogo.png',
    '/pages/akkuyu-taksi.html',
    '/pages/atu-taksi.html',
    '/pages/balcali-taksi.html',
    '/pages/boynuyon-taksi.html',
    '/pages/carkipare-taksi.html',
    '/pages/cinarli-taksi.html',
    '/pages/cukurova-universitesi-taksi.html',
    '/pages/ertugrul-gazi-taksi.html',
    '/pages/gultepe-taksi.html',
    '/pages/hekimkoy-taksi.html',
    '/pages/menekse-taksi.html',
    '/pages/osmangazi-taksi.html',
    '/pages/sofulu-taksi.html',
    '/pages/yesiltepe-taksi.html'
];

// Install Event
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Dosyalar önbelleğe alınıyor...');
                return cache.addAll(ASSETS_TO_CACHE);
            })
    );
});

// Activate Event (Clean up old caches)
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        console.log('Eski önbellek temizleniyor:', cache);
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});

// Fetch Event (Offline Capability)
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Cache hit - return response
                if (response) {
                    return response;
                }
                return fetch(event.request).then(
                    (response) => {
                        // Check if we received a valid response
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        // Clone the response
                        const responseToCache = response.clone();

                        caches.open(CACHE_NAME)
                            .then((cache) => {
                                cache.put(event.request, responseToCache);
                            });

                        return response;
                    }
                );
            })
    );
});
