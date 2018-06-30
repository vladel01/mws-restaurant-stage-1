
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

                    addRestaurantsIdb(data);
                    return callback(null, data);

                });

            } else {

                getRestaurantsIdb();

            }
        }).catch(function() {
            callback('errror', null);
        });
}
