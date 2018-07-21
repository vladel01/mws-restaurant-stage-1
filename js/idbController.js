/**
    * Indexed DB actions for main restaurants data
    */
var dbPromise = idb.open('restaurants-data', 4, function(upgradeDB) {
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
var keyID = [1,2,3,4,5,6,7,8,9,10];
var dbReviews = idb.open('RestaurantReviews', 3, function(upgradeDB) {
    for (let Rid of keyID) {
        upgradeDB.createObjectStore('reviewStore_' + Rid);
    }
});

function addReviewsOneRestaurant(id, data) {
    return dbReviews.then(function(db) {
        var tr = db.transaction(('reviewStore_' + id), 'readwrite');
        tr.objectStore('reviewStore_' + id).put(data, ('Restaurant_' + id));
        return tr.complete;
    })
}

function getReviewsOneRestaurant(id) {
    return dbReviews.then(function(db) {
        var tr = db.transaction('reviewStore_' + id);
        return tr.objectStore('reviewStore_' + id).get('Restaurant_' + id);
    })
}


// Unused after Refactor
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
