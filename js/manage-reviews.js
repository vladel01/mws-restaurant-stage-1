let restaurantReviewVar;

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
                    restaurantReviewVar = responseData;
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

function submitReview(reg) {  //This function is called on sw registration
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

        restaurantReviewVar.push(review);

        dbReviews.then(function(db) {
            var transaction = db.transaction(('reviewStore_' + restaurantId), 'readwrite');
            return transaction.objectStore('reviewStore_' + restaurantId).put(restaurantReviewVar, ('Restaurant_' + restaurantId));
        });

        // ReviewsQueue.then(function(db) {
        //     var trs = db.transaction('PostponedReviews', 'readwrite');
        //     return trs.objectStore('PostponedReviews').put(review);

        store.outbox('readwrite').then(function(outbox) {
            return outbox.put(review);
        }).then(function() {
            // register for sync and clean up the form
            return reg.sync.register('outbox');
        }).catch(function() {
            // something went wrong with the database or the sync registration, log and submit the form
                console.error(err);
                form.submit();
            }    
        );

        fetch('http://localhost:1337/reviews/', {
            method: 'POST',
            body: JSON.stringify(review),
            headers: {
                'content-type': 'application/json'
            }
        }).then(
            addReview
        ).then(
            form.reset()
        ).then(
            alert('Review sent')
        ).catch(
            function(err) { console.log(err) }

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

}
