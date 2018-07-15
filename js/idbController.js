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

function addReviewsOneRestaurant(id, data) {
    return dbPromise.then(function(db) {
        var tx = db.transaction('keyval', 'readwrite');
        var keyValStore = tx.objectStore('keyval');
        keyValStore.put(data, ('reviews-restaurant-' + id));
        return tx.complete;
    })
}

function getReviewsOneRestaurant(id) {
    return dbPromise.then(function(db) {
        var tx = db.transaction('keyval');
        var keyValStore = tx.objectStore('keyval');
        return keyValStore.get('reviews-restaurant-' + id);
    })
}

function addNewReviewToQueue(data) {
    dbPromise.then(function(db) {
        var tx = db.transaction('keyval', 'readwrite');
        var keyValStore = tx.objectStore('keyval');
        return keyValStore.put(data, 'reviews-queue');
    })
}
function getReviewsFromQueue() {
    return dbPromise.then(function(db) {
        var tx = db.transaction('keyval');
        var keyValStore = tx.objectStore('keyval');
        return keyValStore.get('reviews-queue');
    })
}
