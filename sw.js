importScripts('js/idb.js');
importScripts('js/idbController.js');


// NOTE: activate and fetch events are created after the model from webinar "MWS Webinar Stage 3", https://www.youtube.com/watch?v=XbCwxeCqxw4&feature=youtu.be

const RUNTIME = 'runtime';

const PRECACHE = 'mws-restaurant-v71';

self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(PRECACHE).then(function(cache) {
            cache.addAll([
                //'/',
                'index.html',
                //'restaurant.html',
                'css/styles.css',
                'css/responsive.css',
                'css/icons.css',
                'css/font-icons/',
                //'js/idb.js',
                'js/idbController.js',
                'js/dbhelper.js',
                'js/main.js',
                'js/restaurant_info.js',
                'js/lazyLoadImages.min.js',
                'js/manage-data.js',
                'js/manage-reviews.js',
                'js/manage-favorite.js',
                //'data/restaurants.json',
                //'manifest.json',
                //'img/'
            ]);
        })
    );
});

var expectedCaches = [
  'mws-restaurant-v69',
  'mws-rest-data'
];


self.addEventListener('activate', function(event) {
    console.log('Active sw');
    const currentCaches = [PRECACHE, RUNTIME];
    event.waitUntil(
        caches.keys().then(cachesNames => {
            return cachesNames.filter(cacheName => !currentCaches.includes(cacheName));
        }).then(cachesToDelete => {
            return Promise.all(cachesToDelete.map(cachesToDelete => {
                return caches.delete(cachesToDelete);
            }));
        }).then(() => self.clients.claim())
    );
});

// self.addEventListener('fetch', function(event) {
//     event.respondWith(
//         caches.open('mws-rest-data').then(function(cache) {
//             return cache.match(event.request).then(function(response) {
//                 var fetchPromise = fetch(event.request).then(function(networkResponse) {
//                     cache.put(event.request, networkResponse.clone());
//                     return networkResponse;
//                 })
//                 return response || fetchPromise;
//             })
//         })
//     );
// });

self.addEventListener('fetch', function(event) {
    const storageUrl = event.request.url.split(/[?#]/)[0];

    if (storageUrl.startsWith(self.location.origin)) {
        event.respondWith(
            caches.match(storageUrl).then(cachedResponse => {
                if (cachedResponse) {
                    return cachedResponse;
                }

                return caches.open(RUNTIME).then(cache => {
                    return fetch(event.request).then(response => {
                        return cache.put(storageUrl, response.clone()).then(() => {
                            return response;
                        });
                    });
                });
            })
        );
    }
});

self.addEventListener('message', function(event) {
    if (event.data.action === 'skipWaiting') {
        self.skipWaiting();
    }
});


self.addEventListener('sync', function(event) {
  if (event.tag == 'PostponedReviews') {

    console.log('correct tag to make the action');

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
