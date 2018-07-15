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
                    // here ...check if you have reviews to resubmit and then get all new idb reviews
                    addReviewsOneRestaurant(id, responseData);
                    fillReviewsHTML(responseData);  // Function used in restaurant_info

                });

            } else {

                getReviewsOneRestaurant(id).then(function(cachedReviews) {
                    fillReviewsHTML(cachedReviews);
                });
                //getReviewsFromQueue(); // Continue here. Should I get these reviews if still offline? This get should be used for the online reconnecting situation/fucntion

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

    let restaurantReviewsKeeper = '';
    let reviewsOnHold = [];


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
            getReviewsOneRestaurant(restaurantId).then(function(reviewsStore){
                restaurantReviewsKeeper = reviewsStore;
                console.log(reviewsStore);
            })
        ).then(
            response => response.json().then(
                function(responseData) {
                    restaurantReviewsKeeper.push(responseData);
                    console.log(responseData);
                    console.log(restaurantReviewsKeeper);

                    addReviewsOneRestaurant(restaurantId, restaurantReviewsKeeper);
                }
            )
        ).then(
            addReview
        ).then(
            form.reset()
        ).then(
            alert('Review sent')
        ).catch(

                // getReviewsOneRestaurant(restaurantId).then(function(reviewsStored){
                //     restaurantReviewsKeeper = reviewsStored;
                // }).then(
                //     function() {
                //         console.log(review);
                //         restaurantReviewsKeeper.push(review);
                //         addReviewsOneRestaurant(restaurantId, restaurantReviewsKeeper);
                //
                //         getReviewsFromQueue().then(function(reviewsWaiting){
                //             reviewsOnHold = reviewsWaiting;
                //         }).then(reviewsOnHold.push(review)).then(addNewReviewToQueue(reviewsOnHold));
                //
                //         //console.log(reviewsOnHold);
                //
                //         addReview();
                //         alert('No network connection. Your review will be available to others after you reconnect')
                //     }
                // )
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
