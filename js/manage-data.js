function openDatabase(data) {
    return dbPromise = idb.open('restaurants-data', 1, function(upgradeDB) {
        var keyValStore = upgradeDB.createObjectStore('keyval');
        keyValStore.put(data, 'cached-restaurants');
    });
}

function getDatabase(data) {
    return dbPromise.then(function(db) {
        var tx = db.transaction('keyval');
        var keyValStore = tx.objectStore('keyval');
        return keyValStore.get(data);
    });
}

function fetchingRestaurants(callback) {
    fetch('http://localhost:1337/restaurants', {
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(function(response) {
            if (response.status !== 200) {
                console.log('Request failed. Returned status of ' + response.status);
                return;
            }
            if (response) {
                response.json().then(function(data) {

                    openDatabase(data);
                    return callback(null, data);

                });

            } else {

                getDatabase('restaurants-data');

            }
        }).catch(function() {
            callback('errror', null);
        });
}
