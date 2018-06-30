function openReviewsDatabase(data) {
    return dbPromise = idb.open('restaurants-reviews', 2, function(upgradeDB) {
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

function addReviewToIdb(data) {
    return dbPromise.then(function(db) {
        const tx = db.transaction('reviewkeyval', 'readwrite');
        tx.objectStore('reviewkeyval').put(data, 'cached-reviews');
        return tx.complete;
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


function checkboxRating(checkbox) {
    var checkboxes = document.getElementsByName('rating');
    var getRateValue = document.getElementById('ratingHaveValue');

    checkboxes.forEach((item) => {
        if (item !== checkbox) item.checked = false
        getRateValue.setAttribute('value', checkbox.value);
    })
}


(function () {
    const form = document.getElementById('newReview');
    let review;
    const nameField = document.getElementById('username');
    const ratingField = document.getElementById('ratingHaveValue');
    const commentField = document.getElementById('comment');
    const restaurantInfo = document.getElementById('restID');

    const responseContainer = document.getElementById('reviews-list');

    let nameValue;
    let ratingValue;
    let commentValue;
    let restaurantId;



    form.addEventListener('submit', function (e) {
        e.preventDefault();
        nameValue = nameField.value;
        ratingValue = ratingField.value;
        commentValue = commentField.value;
        restaurantId = restaurantInfo.value;

        var review = { restaurant_id: restaurantId, name: nameValue, rating: ratingValue, comments: commentValue };


        fetch('http://localhost:1337/reviews/', {
            method: 'POST',
            body: JSON.stringify(review),
            headers: {
                'content-type': 'application/json'
            }
        }).then(
            response => response.json()
        ).then(
            addReview
        ).then(
            response => addReviewToIdb(response)
        )
        .then(
            form.reset()
        )
        .catch(
            error => { console.log(error); }
        );

        function addReview() {
            let htmlContent = '';
            const newReview = document.createElement('li');
            newReview.setAttribute('role', 'listitem');
            newReview.setAttribute('tabindex', '0');

            htmlContent = '<p><strong>Author: </strong>' + nameValue + '</p>' +
                            '<p><strong>Rating: </strong>' +
                            '<span class="star-rate color-' + ratingValue + '" aria-label="' + ratingValue + ' stars">' +
                                '<i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i>' +
                            '</span>' +
                           '</p>' +
                           '<p class="review-comment">' + commentValue + '</p>';

            newReview.innerHTML = htmlContent;

            responseContainer.append(newReview);
        }
    });

})();
