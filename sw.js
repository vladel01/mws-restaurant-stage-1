var myCacheNames = 'mws-restaurant-v5';

self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(myCacheNames).then(function(cache) {
            return cache.addAll([
                '/',
                'index.html',
                'restaurant.html',
                'css/styles.css',
                'css/responsive.css',
                'js/dbhelper.js',
                'js/main.js',
                'js/restaurant_info.js',
                'js/idb.js',
                'js/manage-data.js',
                //'data/restaurants.json',
                //'/img',
                'https://use.fontawesome.com/releases/v5.0.9/css/all.css'
            ]);
        })
    );
});


self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.filter(function(cacheName) {
                    return cacheName.startsWith('mws-') &&
                        cacheName != myCacheNames;
                }).map(function(cacheName) {
                    return caches.delete(cacheName);
                })
            );
        })
    );
});

// The following solution for fetch, is inspired from https://jakearchibald.com/2014/offline-cookbook/
self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.open(myCacheNames).then(function(cache) {
            return cache.match(event.request).then(function(response) {
                return response || fetch(event.request).then(function(response) {
                    cache.put(event.request, response.clone());
                    return response;
                });
            });
        })
    );
});

self.addEventListener('message', function(event) {
    if (event.data.action === 'skipWaiting') {
        self.skipWaiting();
    }
});
