importScripts('js/idb.js');
importScripts('js/idbController.js');

console.log('sevice worker present');

var myCacheNames = 'mws-restaurant-v37';

self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(myCacheNames).then(function(cache) {
            return cache.addAll([
                '/',
                'index.html',
                'restaurant.html',
                'css/styles.css',
                'css/responsive.css',
                'css/icons.css',
                'css/font-icons/',
                'js/idb.js',
                'js/idbController.js',
                'js/dbhelper.js',
                'js/main.js',
                'js/restaurant_info.js',
                'js/lazyLoadImages.min.js',
                'js/manage-data.js',
                'js/manage-reviews.js',
                'js/manage-favorite.js',
                //'data/restaurants.json',
                'manifest.json',
                'img/'
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


self.addEventListener('sync', function(event) {
  if (event.tag == 'PostponedReviews') {
    event.waitUntil(
        getAllPostponed().then(function(reviews) {
            return Promise.all(reviews.map(function(rev) {
                return fetch('http://localhost:1337/reviews/', {
                    method: 'POST',
                    body: JSON.stringify(rev),
                    headers: {
                        'content-type': 'application/json'
                    }
                }).then(function(response) {
                    return response.json();
                }).then(function() {

                        deletePostponed(rev.id);
                        console.log('Your review has been submitted to the server. If any review was pending, it has also been sent');
                })
            })
            )
        }).catch(function(err) { console.error(err); })
    );
  }
});
