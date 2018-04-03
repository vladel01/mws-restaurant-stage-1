let restaurant;
var map;

/**
 * Initialize Google map, called from HTML.
 */
window.initMap = () => {
    fetchRestaurantFromURL((error, restaurant) => {
    if (error) { // Got an error!
        console.error(error);
    } else {
        self.map = new google.maps.Map(document.getElementById('map'), {
            zoom: 16,
            center: restaurant.latlng,
            scrollwheel: false
        });
        fillBreadcrumb();
        DBHelper.mapMarkerForRestaurant(self.restaurant, self.map);
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
        fillRestaurantHTML();
        callback(null, restaurant)
    });
  }
}

/**
 * Create restaurant HTML and add it to the webpage
 */
fillRestaurantHTML = (restaurant = self.restaurant) => {
    const name = document.getElementById('restaurant-name');
    name.innerHTML = restaurant.name;
    name.setAttribute('role', 'heading');

    const address = document.getElementById('restaurant-address');
    address.innerHTML = '<i class="fas fa-map-marker-alt"></i>' + restaurant.address;
    address.setAttribute('role', 'contentinfo');
    address.setAttribute('aria-label', 'Address' + restaurant.address);

    const picture = document.getElementById('restaurant-img');
    picture.className = 'restaurant-img';

    const sourceLarge = document.createElement('source');
    sourceLarge.media = '(min-width: 651px)';
    sourceLarge.srcset = DBHelper.imageUrlForRestaurantLarge(restaurant);
    picture.append(sourceLarge);

    const sourceMedium = document.createElement('source');
    sourceMedium.media = '(min-width: 401px)';
    sourceMedium.srcset = DBHelper.imageUrlForRestaurantMedium(restaurant);
    picture.append(sourceMedium);

    const image = document.createElement('img');
    image.src = DBHelper.imageUrlForRestaurant(restaurant);
    image.srcset = DBHelper.imageUrlForRestaurant2x(restaurant);
    image.alt = restaurant.name;
    picture.append(image);

    const cuisine = document.getElementById('restaurant-cuisine');
    cuisine.innerHTML = restaurant.cuisine_type;
    cuisine.setAttribute('aria-label', 'Cuisine ' + restaurant.cuisine_type);

    // fill operating hours
    if (restaurant.operating_hours) {
        fillRestaurantHoursHTML();
    }
    // fill reviews
    fillReviewsHTML();

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
fillReviewsHTML = (reviews = self.restaurant.reviews) => {
    const container = document.getElementById('reviews-container');
    const title = document.createElement('h2');
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
        ul.appendChild(createReviewHTML(review));
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

    const date = document.createElement('p');
    date.innerHTML = '<strong>Date: </strong>' + review.date;
    li.appendChild(date);

    const rating = document.createElement('p');

    const ratingStarsClass = 'color-' + review.rating;
    const ratingStars = document.createElement('span');
    ratingStars.classList.add('star-rate');
    ratingStars.setAttribute('aria-label', review.rating + ' stars');
    ratingStars.classList.add(ratingStarsClass);
    ratingStars.innerHTML = '<i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i>';

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
