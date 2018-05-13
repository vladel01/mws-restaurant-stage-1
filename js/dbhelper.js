/**
 * Common database helper functions.
 */

class DBHelper {

    /**
        * Fetch all restaurants.
        */

    static fetchRestaurants(callback) {
        fetchingRestaurants(callback);
    }

    /**
        * Fetch a restaurant by its ID.
        */
    static fetchRestaurantById(id, callback) {
        // fetch all restaurants with proper error handling.
        DBHelper.fetchRestaurants((error, restaurants) => {
            if (error) {
                callback(error, null);
            } else {
                const restaurant = restaurants.find(r => r.id == id);
                    if (restaurant) { // Got the restaurant
                        callback(null, restaurant);
                    } else { // Restaurant does not exist in the database
                        callback('Restaurant does not exist', null);
                    }
            }
        });
    }

    /**
        * Fetch restaurants by a cuisine type with proper error handling.
    */
    static fetchRestaurantByCuisine(cuisine, callback) {
        // Fetch all restaurants  with proper error handling
        DBHelper.fetchRestaurants((error, restaurants) => {
            if (error) {
                callback(error, null);
            } else {
                // Filter restaurants to have only given cuisine type
                const results = restaurants.filter(r => r.cuisine_type == cuisine);
                callback(null, results);
            }
        });
    }

    /**
    * Fetch restaurants by a neighborhood with proper error handling.
    */
    static fetchRestaurantByNeighborhood(neighborhood, callback) {
        // Fetch all restaurants
        DBHelper.fetchRestaurants((error, restaurants) => {
            if (error) {
                callback(error, null);
            } else {
                // Filter restaurants to have only given neighborhood
                const results = restaurants.filter(r => r.neighborhood == neighborhood);
                callback(null, results);
            }
        });
    }

    /**
        * Fetch restaurants by a cuisine and a neighborhood with proper error handling.
    */
    static fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, callback) {
        // Fetch all restaurants
        DBHelper.fetchRestaurants((error, restaurants) => {
            if (error) {
                callback(error, null);
            } else {
                let results = restaurants
                if (cuisine != 'all') { // filter by cuisine
                    results = results.filter(r => r.cuisine_type == cuisine);
                }
                if (neighborhood != 'all') { // filter by neighborhood
                    results = results.filter(r => r.neighborhood == neighborhood);
                }
                    callback(null, results);
            }
        });
    }

    /**
        * Fetch all neighborhoods with proper error handling.
    */
    static fetchNeighborhoods(callback) {
        // Fetch all restaurants
        DBHelper.fetchRestaurants((error, restaurants) => {
            if (error) {
                callback(error, null);
            } else {
                // Get all neighborhoods from all restaurants
                const neighborhoods = restaurants.map((v, i) => restaurants[i].neighborhood)
                // Remove duplicates from neighborhoods
                const uniqueNeighborhoods = neighborhoods.filter((v, i) => neighborhoods.indexOf(v) == i)
                callback(null, uniqueNeighborhoods);
            }
        });
    }

    /**
        * Fetch all cuisines with proper error handling.
    */
    static fetchCuisines(callback) {
        // Fetch all restaurants
        DBHelper.fetchRestaurants((error, restaurants) => {
            if (error) {
                callback(error, null);
            } else {
                // Get all cuisines from all restaurants
                const cuisines = restaurants.map((v, i) => restaurants[i].cuisine_type)
                // Remove duplicates from cuisines
                const uniqueCuisines = cuisines.filter((v, i) => cuisines.indexOf(v) == i)
                callback(null, uniqueCuisines);
            }
        });
    }

    /**
    * Restaurant page URL.
    */
    static urlForRestaurant(restaurant) {
        return (`./restaurant.html?id=${restaurant.id}`);
    }

    /**
        * Restaurant name text fix - replacing spaces
    */
    static nameReplace(restaurant) {
        var restaurantName = `${restaurant.name}`;
        return restaurantName.split(' ').join('_');
    }

    /**
        * Restaurant image URL.
    */
    static imageUrlForRestaurant(restaurant) {  // using small image as default
        return (`/img/` + DBHelper.nameReplace(restaurant) + `-400_small.jpg`);
    }
    static imageUrlForRestaurant2x(restaurant) {
        return (`/img/` + DBHelper.nameReplace(restaurant) + `-400_small_2x.jpg 2x`);
    }
    static imageUrlForRestaurantMedium(restaurant) {
        return (`/img/` + DBHelper.nameReplace(restaurant) + `-650_medium.jpg, /img/` + DBHelper.nameReplace(restaurant) + `-650_medium_2x.jpg 2x`);
    }
    static imageUrlForRestaurantLarge(restaurant) {
        return (`/img/` + DBHelper.nameReplace(restaurant) + `-800_large.jpg, /img/` + DBHelper.nameReplace(restaurant) + `-800_large_2x.jpg 2x`);
    }

    /**
        * Map marker for a restaurant.
    */
    static mapMarkerForRestaurant(restaurant, map) {
        const marker = new google.maps.Marker({
            position: restaurant.latlng,
            title: restaurant.name,
            url: DBHelper.urlForRestaurant(restaurant),
            map: map,
            animation: google.maps.Animation.DROP}
        );
        return marker;
    }

}
