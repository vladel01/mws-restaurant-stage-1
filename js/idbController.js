/**
    * Indexed DB actions for main restaurants data
    */
var dbPromise = idb.open('restaurants-data', 4, function(upgradeDB) {
    var keyValStore = upgradeDB.createObjectStore('keyval');
});

function addRestaurantsIdb(data) {
    return dbPromise.then(function(db) {
        var tx = db.transaction('keyval', 'readwrite');
        var keyValStore = tx.objectStore('keyval');
        return keyValStore.put(data, 'restaurants-info');
    })
}

function getRestaurantsIdb() {
    return dbPromise.then(function(db) {
        var tx = db.transaction('keyval');
        var keyValStore = tx.objectStore('keyval');
        return keyValStore.get('restaurants-info');
    })
}

/**
    * Indexed DB actions for reviews of restaurants
    */
var keyID = [1,2,3,4,5,6,7,8,9,10];
var dbReviews = idb.open('RestaurantReviews', 2, function(upgradeDB) {
    for (let Rid of keyID) {
        upgradeDB.createObjectStore('reviewStore_' + Rid);
    }
});

function addReviewsOneRestaurant(id, data) {
    return dbReviews.then(function(db) {
        var tr = db.transaction(('reviewStore_' + id), 'readwrite');
        tr.objectStore('reviewStore_' + id).put(data, ('Restaurant_' + id));
    })
}

function getReviewsOneRestaurant(id) {
    return dbReviews.then(function(db) {
        var tr = db.transaction('reviewStore_' + id);
        tr.objectStore('reviewStore_' + id).get('Restaurant_' + id);
    })
}


// Unused after Refactor
// var dbReviewsQueue = idb.open('OfflineReviews', 1, function(upgradeDB) {
//     upgradeDB.createObjectStore('PostponedReviews', { autoIncrement : true, keyPath: 'id' });
// });


// var store = {
//     db: null,
//
//     init: function() {
//         if (store.db) { return Promise.resolve(store.db); }
//         return idb.open('OfflineReviews', 1, function(upgradeDb) {
//             upgradeDb.createObjectStore('PostponedReviews', { autoIncrement : true, keyPath: 'id' });
//         }).then(function(db) {
//             return store.db = db;
//         });
//     },
//
//     outbox: function(mode) {
//         return store.init().then(function(db) {
//             return db.transaction('PostponedReviews', mode).objectStore('PostponedReviews');
//         })
//     }
// }

var store = {
  db: null,

  init: function() {
    if (store.db) { return Promise.resolve(store.db); }
    return idb.open('messages', 1, function(upgradeDb) {
      upgradeDb.createObjectStore('outbox', { autoIncrement : true, keyPath: 'id' });
    }).then(function(db) {
      return store.db = db;
    });
  },

  outbox: function(mode) {
    return store.init().then(function(db) {
      return db.transaction('outbox', mode).objectStore('outbox');
    })
  }
}


// aDD review to queue should be like this:
//  var transaction = db.transaction(('reviewStore_' + restaurantId), 'readwrite');
//  return transaction.objectStore('reviewStore_' + restaurantId).put(review, ('NewReview_' + restaurantId));


// function addNewReviewToQueue(data) {
//     dbReviews.then(function(db) {
//         var tx = db.transaction('keyval', 'readwrite');
//         var keyValStore = tx.objectStore('keyval');
//         return keyValStore.put(data, 'reviews-queue');
//     })
// }
// function getReviewsFromQueue() {
//     return dbReviews.then(function(db) {
//         var tx = db.transaction('keyval');
//         var keyValStore = tx.objectStore('keyval');
//         return keyValStore.get('reviews-queue');
//     })
// }
