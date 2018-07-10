var dbPromise = idb.open('restaurants-data', 3, function(upgradeDB) {
    var keyValStore = upgradeDB.createObjectStore('keyval');
    //keyValStore.put(data, 'cached-restaurants');
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

function addReviewsOneRestaurant(id, data) {
    return dbPromise.then(function(db) {
        var tx = db.transaction('keyval', 'readwrite');
        var keyValStore = tx.objectStore('keyval');
        return keyValStore.put(data, ('reviews-restaurant-' + id));
    })
}

function getReviewsOneRestaurant(id) {
    return dbPromise.then(function(db) {
        var tx = db.transaction('keyval');
        var keyValStore = tx.objectStore('keyval');
        return keyValStore.get('reviews-restaurant-' + id);
    })
}


// function addReviewsAfterForm(id, data) {
//     return dbPromise.then(function(db) {
//         var tx = db.transaction('keyval', 'readwrite');
//         var keyValStore = tx.objectStore('keyval');
//         return keyValStore.put(data, ('reviews-restaurant-' + id));
//     })
// }
//
// function addNewReviewToQueue(data) {
//
// }
