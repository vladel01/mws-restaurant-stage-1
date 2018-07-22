/**
    * Indexed DB actions for main restaurants data
    */
var dbPromise = idb.open('restaurants-data', 5, function(upgradeDB) {
    var keyValStore = upgradeDB.createObjectStore('keyval');
});

function addRestaurantsIdb(data) {
    return dbPromise.then(function(db) {
        var tx = db.transaction('keyval', 'readwrite');
        return tx.objectStore('keyval').put(data, 'restaurants-info');
        //tx.complete;
    })
}

function getRestaurantsIdb() {
    return dbPromise.then(function(db) {
        var tx = db.transaction('keyval');
        return tx.objectStore('keyval').get('restaurants-info');
        //return tx.complete;
    })
}

/**
    * Indexed DB actions for reviews of restaurants
    */

var dbReviews = idb.open('RestaurantReviews', 4, function(upgradeDB) {
    upgradeDB.createObjectStore('reviewStore');
});

function addReviewsOneRestaurant(id, data) {
    var restaurantNo = 'Restaurant_' + id;
    return dbReviews.then(function(db) {
        var tr = db.transaction('reviewStore', 'readwrite');
        tr.objectStore('reviewStore').put(data, restaurantNo);
        return tr.complete;
    })
}

function getReviewsOneRestaurant(id) {
    var restaurantNo = 'Restaurant_' + id;
    return dbReviews.then(function(db) {
        var tr = db.transaction('reviewStore');
        return tr.objectStore('reviewStore').get(restaurantNo);
    })
}

var dbReviewsQueue = idb.open('OfflineReviews', 2, function(upgradeDB) {
    upgradeDB.createObjectStore('PostponedReviews', { autoIncrement : true, keyPath: 'id' });
});

function getAllPostponed() {
    return dbReviewsQueue.then(function(db) {
        var tx = db.transaction('PostponedReviews')
        return tx.objectStore('PostponedReviews').getAll();
    })
}

function deletePostponed(key) {
    return dbReviewsQueue.then(function(db) {
        var tx = db.transaction('PostponedReviews', 'readwrite');
        return tx.objectStore('PostponedReviews').delete(key);
    })
}
