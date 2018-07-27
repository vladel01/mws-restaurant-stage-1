let restaurant;
var newMap;
var mapScroll;
/**
 * Initialize Leaflet map, called from HTML.
 */
document.addEventListener('DOMContentLoaded', (event) => {
  initMap();
});
 /**
 * Initialize leaflet map
 */
initMap = () => {
    fetchRestaurantFromURL((error, restaurant) => {
        if (error) { // Got an error!
            console.error(error);
        } else {
            self.newMap = L.map('map', {
                center: [restaurant.latlng.lat, restaurant.latlng.lng],
                zoom: 16,
                scrollWheelZoom: false
            });
            L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.jpg70?access_token={mapboxToken}', {
                mapboxToken: 'pk.eyJ1IjoidmxhZGVsIiwiYSI6ImNqazRkc2ZxazFjdHMzcm1sZGw5cHhjY3EifQ.ehGI_QvTOYUKcF7IHDq58A',
                maxZoom: 18,
                attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
                    '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
                    'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
                id: 'mapbox.streets'
            }).addTo(newMap);

            fillBreadcrumb();
            DBHelper.mapMarkerForRestaurant(self.restaurant, self.newMap);
        }
    });
}

/**
 * Get current restaurant from page URL.
 */
fetchRestaurantFromURL = (callback) => {
    if (self.restaurant) { // restaurant already fetched!
        callback(null, self.restaurant)
        return;
    }
    const id = getParameterByName('id');
    if (!id) { // no id found in URL
        error = 'No restaurant id in URL'
        callback(error, null);
    } else {
    DBHelper.fetchRestaurantById(id, (error, restaurant) => {
        self.restaurant = restaurant;
        if (!restaurant) {
            console.error(error);
            return;
        }

        fillRestaurantHTML(restaurant);

        callback(null, restaurant)  // this is the data of the review gotten used in the fetchRestaurantFromURL

        if (navigator.onLine) {
            getReviewsOfRestaurant(restaurant.id);
        } else {
            getReviewsFromLocal(restaurant.id).then(function(cachedRevs) {
                console.log('local stored reviews are displyed');
                fillReviewsHTML(cachedRevs);
            });
        }

        console.log(restaurant);
    });


  }
}

/**
 * Create restaurant HTML and add it to the webpage
 */
fillRestaurantHTML = (restaurant) => {
    const name = document.getElementById('restaurant-name');
    name.innerHTML = restaurant.name;
    name.setAttribute('role', 'heading');

    const IdInput = document.getElementById('restID');
    IdInput.setAttribute('value', restaurant.id);

    const address = document.getElementById('restaurant-address');
    address.innerHTML = '<i class="icon-location"></i>' + restaurant.address;
    address.setAttribute('role', 'contentinfo');
    address.setAttribute('aria-label', 'Address' + restaurant.address);

    const picture = document.getElementById('restaurant-img');
    picture.className = 'restaurant-img';

    const image = document.createElement('img');
    //image.src = DBHelper.imageUrlForRestaurant(restaurant);
    image.setAttribute('data-src', (DBHelper.imageUrlForRestaurant(restaurant)));
    //image.srcset = DBHelper.imageUrlForRestaurant2x(restaurant);
    image.setAttribute('data-srcset', (DBHelper.imageUrlForRestaurantMediumWPort(restaurant)));
    image.alt = restaurant.name;
    image.className = 'lazyload';
    picture.append(image);

    const cuisine = document.getElementById('restaurant-cuisine');
    cuisine.innerHTML = restaurant.cuisine_type;
    cuisine.setAttribute('aria-label', 'Cuisine ' + restaurant.cuisine_type);

    const favoriteWrapper = document.getElementById('favoriteTask');
    favoriteWrapper.setAttribute('data-id', restaurant.id);

    const favoriteStat = document.getElementById('favorite-checkbox');

    if (restaurant.is_favorite == "true") {
        JSON.parse(restaurant.is_favorite) === true;
    } else if (restaurant.is_favorite == "false") {
        JSON.parse(restaurant.is_favorite) === false;
    }

    if ((restaurant.is_favorite == true) || (restaurant.is_favorite == "true") || (restaurant.is_favorite === "true")){
        favoriteStat.checked = true;
    }else if ((restaurant.is_favorite == false) || (restaurant.is_favorite == "false") || (restaurant.is_favorite === "false")) {
        favoriteStat.checked = false;
    }

    // fill operating hours
    if (restaurant.operating_hours) {
        fillRestaurantHoursHTML();
    }

    const hoursH3 = document.getElementById('restaurant-short-schedule');
    if (restaurant.operating_hours.Saturday == restaurant.operating_hours.Sunday) {
        hoursH3.innerHTML = 'Opening times on Weekdays ' + restaurant.operating_hours.Monday + ' and on Weekends ' + restaurant.operating_hours.Saturday;
    }else {
        hoursH3.innerHTML = 'Opening times on Weekdays ' + restaurant.operating_hours.Monday + ' and on Weekends: Saturday ' + restaurant.operating_hours.Saturday + ', and Sunday ' + restaurant.operating_hours.Sunday;
    }
}

/**
 * Create restaurant operating hours HTML table and add it to the webpage.
 */
fillRestaurantHoursHTML = (operatingHours = self.restaurant.operating_hours) => {
    const hours = document.getElementById('restaurant-hours');

    for (let key in operatingHours) {
        const row = document.createElement('tr');
        //row.setAttribute('tabindex', '0');
        row.setAttribute('role', 'row');

        const day = document.createElement('td');
        day.innerHTML = key;
        row.appendChild(day);

        const time = document.createElement('td');
        time.innerHTML = operatingHours[key];
        row.appendChild(time);

        hours.appendChild(row);
    }
}

/**
 * Create all reviews HTML and add them to the webpage.
 */

fillReviewsHTML = (reviews) => {
    const container = document.getElementById('reviews-container');
    const title = document.createElement('h3');
    title.innerHTML = 'Reviews';
    container.appendChild(title);

    if (!reviews) {
        const noReviews = document.createElement('p');
        noReviews.innerHTML = 'No reviews yet!';
        container.appendChild(noReviews);
        return;
    }
    const ul = document.getElementById('reviews-list');
    ul.setAttribute('role', 'list');
    ul.setAttribute('aria-label', title.innerHTML);
    reviews.forEach(review => {

        ul.insertBefore(createReviewHTML(review), ul.firstChild);
    });
    container.appendChild(ul);
}

/**
 * Create review HTML and add it to the webpage.
 */
createReviewHTML = (review) => {
    const li = document.createElement('li');
    li.setAttribute('role', 'listitem');
    li.setAttribute('tabindex', '0');

    const name = document.createElement('p');
    name.innerHTML = '<strong>Author: </strong>' + review.name;
    li.appendChild(name);

    const rating = document.createElement('p');

    const ratingStarsClass = 'color-' + review.rating;
    const ratingStars = document.createElement('span');
    ratingStars.classList.add('star-rate');
    ratingStars.setAttribute('aria-label', review.rating + ' stars');
    ratingStars.classList.add(ratingStarsClass);
    ratingStars.innerHTML = '<i class="icon-star"></i><i class="icon-star"></i><i class="icon-star"></i><i class="icon-star"></i><i class="icon-star"></i>';

    rating.innerHTML = '<strong>Rating: </strong>';
    rating.appendChild(ratingStars);


    li.appendChild(rating);

    const comments = document.createElement('p');
    comments.classList.add('review-comment');
    comments.innerHTML = review.comments;
    li.appendChild(comments);

    return li;
}

/**
 * Add restaurant name to the breadcrumb navigation menu
 */
fillBreadcrumb = (restaurant=self.restaurant) => {
    const breadcrumb = document.getElementById('breadcrumb');
    const li = document.createElement('li');
    li.innerHTML = restaurant.name;
     li.setAttribute('aria-current', 'page');
    breadcrumb.appendChild(li);
}

/**
 * Get a parameter by name from page URL.
 */
getParameterByName = (name, url) => {
    if (!url)
        url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`),
        results = regex.exec(url);
    if (!results)
        return null;
    if (!results[2])
        return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}


window.addEventListener('online', function(e) {
    // console.log('online');
    const offlineMsg = document.querySelector('.notsent-msg');
    setTimeout(
        function() {
            offlineMsg.innerHTML = "Review landed to our server";
            offlineMsg.classList.add('got-sent');
        },4000);
});
