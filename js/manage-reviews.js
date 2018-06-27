function openReviewsDatabase(data) {
    return dbPromise = idb.open('restaurants-reviews', 1, function(upgradeDB) {
        var keyValStore = upgradeDB.createObjectStore('reviewkeyval');
        keyValStore.put(data, 'cached-reviews');
    });
}

function getReviewsDatabase(data) {
    return dbPromise.then(function(db) {
        var tx = db.transaction('reviewkeyval');
        var keyValStore = tx.objectStore('reviewkeyval');
        return keyValStore.get(data);
    });
}


function getReviewsOfRestaurant(id) {
    fetch('http://localhost:1337/reviews/?restaurant_id=' + id, {
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(function(response) {
            if (response.status !== 200) {
                console.log('Request failed. Returned status of ' + response.status);
                return;
            }
            if (response) {
                response.json().then(function(responseData) {

                    openReviewsDatabase(responseData);
                    fillReviewsHTML(responseData);  // Function used in restaurant_info

                });

            } else {

                getReviewsDatabase('restaurants-reviews');

            }
        }).catch(function() {
            callback('errror', null);
        });
}
