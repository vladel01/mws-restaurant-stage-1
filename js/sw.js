var myCacheNames = 'mws-restaurant-v4';

importScripts('cache-polyfill.js');

self.addEventListener('install', function(e) {
    e.waitUntil(
        caches.open(myCacheNames).then(function(cache) {
            return cache.addAll([
                '/',
                '/index.html',
                '/restaurant.html',
                '/css/styles.css',
                '/css/responsive.css',
                'dbhelper.js',
                'main.js',
                'restaurant_info.js',
                '/data/restaurants.json',
                //'/img',
                'https://use.fontawesome.com/releases/v5.0.9/css/all.css'
            ]);
        })
    );
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request).then(function(response) {
            if (response) return response;
            return fetch(event.request);
        })
    );
});
