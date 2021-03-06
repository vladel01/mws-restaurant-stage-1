function fetchingRestaurantsFromServer() {
    return fetch('http://localhost:1337/restaurants', {
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(function(response) {
        if (response.status !== 200) {
            console.log('Request failed. Returned status of ' + response.status);
            return;
        }

        if(response.ok) {
            return response.json();
        }

    }).then(function(restaurantData) {
        addRestaurantsIdb(restaurantData);
    }).catch(function(error) {
        console.log('Problem with your restaurant fetch operation: ', error.message);
        // callback('errror', null);
        // getRestaurantsIdb().then(function(cachedRestaurants) {
        //     console.log('No network')
        //     return callback(null, cachedRestaurants);
        // });
    });
}
