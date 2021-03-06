// NOTE: activate and fetch events are created after the model from webinar "MWS Webinar Stage 3", https://www.youtube.com/watch?v=XbCwxeCqxw4&feature=youtu.be

const RUNTIME = 'runtime';

const PRECACHE = 'mws-restaurant-v78';

self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(PRECACHE).then(function(cache) {
            cache.addAll([
                'index.html',
                'css/styles.css',
                'css/responsive.css',
                'css/icons.css',
                'css/font-icons/',
                'js/idbController.js',
                'js/dbhelper.js',
                'js/main.js',
                'js/restaurant_info.js',
                'js/lazyLoadImages.min.js',
                'js/manage-data.js',
                'js/manage-reviews.js',
                'js/manage-favorite.js'
            ]);
        })
    );
});


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
