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

                    addReviewsOneRestaurant(id, responseData);
                    fillReviewsHTML(responseData);  // Function used in restaurant_info

                }).then(function(data) {

                });

            } else {

                getReviewsOneRestaurant(id);

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
                    // continue here --> This happens when has response. When no response, add data to special queue idb
                }
            )
        ).then(
            addReview
        ).then(
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
