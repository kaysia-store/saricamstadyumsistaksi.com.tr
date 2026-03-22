const CACHE_NAME = 'sis-taksi-v2';
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
    '/pages/boynuyogun-taksi.html',
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

// Fetch Event (Network First for HTML, Cache First for assets)
self.addEventListener('fetch', (event) => {
    // Skip cross-origin requests
    if (!event.request.url.startsWith(self.location.origin)) {
        return;
    }

    const isHTML = event.request.headers.get('accept').includes('text/html');

    if (isHTML) {
        // Network First Strategy for HTML
        event.respondWith(
            fetch(event.request)
                .then((response) => {
                    // Update cache with new version found on network
                    const responseToCache = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseToCache);
                    });
                    return response;
                })
                .catch(() => {
                    // Fallback to cache if network fails
                    return caches.match(event.request);
                })
        );
    } else {
        // Cache First Strategy for Assets (Images, CSS, JS)
        // This is more efficient. To refresh these "once a day", 
        // we can rely on standard browser cache headers or just versioning.
        // For this user 'refresh daily' request, keeping them cached is better for PWA feeling.
        // The HTML being Network First ensures that if we update the version in HTML (e.g. valid cache busting),
        // the new assets will be fetched.
        event.respondWith(
            caches.match(event.request)
                .then((response) => {
                    return response || fetch(event.request).then((response) => {
                        const responseToCache = response.clone();
                        caches.open(CACHE_NAME).then((cache) => {
                            cache.put(event.request, responseToCache);
                        });
                        return response;
                    });
                })
        );
    }
});
