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

        if(response.ok) {
            return response.json().then(function(responseData) {
                fillReviewsHTML(responseData);
                addReviewsOneRestaurant(id, responseData);
            });
        }

    }).catch(function(error) {
        console.log('There has been a problem with your fetch operation: ', error.message);
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

    let restaurantReviewVarKeeper;

    function formValidate() {
        if ((nameField.value == '') || (ratingField.value == '') || (commentField.value == '')) {
            alert('Please fill all the fields and select your star rating');
            return false;
        }
    }


    function submitReviews() {
        nameValue = nameField.value;
        ratingValue = ratingField.value;
        commentValue = commentField.value;
        restaurantId = restaurantInfo.value;

        var review = { restaurant_id: restaurantId, name: nameValue, rating: ratingValue, comments: commentValue };


        /**
            * Post review to the server or sent it to the local db.
            */
        if (navigator.onLine) {
            fetch('http://localhost:1337/reviews/', {
                method: 'POST',
                body: JSON.stringify(review),
                headers: {
                    'content-type': 'application/json'
                }
            }).then(function(response) {
                return response.json();

                if (response.ok) {
                    console.log('Your review has been submitted');
                }
            }).catch(() => console.log('something went wrong with the sending'))
        } else {
            dbReviewsQueue.then(function(db) {
                var trs = db.transaction('PostponedReviews', 'readwrite');
                return trs.objectStore('PostponedReviews').put(review);
            });
        }

        /**
            * Adding HTML of review and reset form.
            */
        addReview();

        form.reset();


        function addReview() {
            let htmlContent = '';
            const newReview = document.createElement('li');
            newReview.setAttribute('role', 'listitem');
            newReview.setAttribute('tabindex', '0');

            htmlContent = '<p><strong>Author: </strong>' + nameValue + '</p>' +
                            '<p><strong>Rating: </strong>' +
                            '<span class="star-rate color-' + ratingValue + '" aria-label="' + ratingValue + ' stars">' +
                                '<i class="icon-star"></i><i class="icon-star"></i><i class="icon-star"></i><i class="icon-star"></i><i class="icon-star"></i>' +
                            '</span>' +
                           '</p>' +
                           '<p class="review-comment">' + commentValue + '</p>' +
                           '<span id="temp-msg"></span>';

            newReview.innerHTML = htmlContent;

            responseContainer.prepend(newReview);
        }

    };


/**
    * Event on submitting the form.
    */
form.addEventListener('submit', event => {
    event.preventDefault()

    submitReviews();

    const newRevWrapper = document.getElementById('temp-msg');
    if (navigator.onLine) {
        newRevWrapper.className = 'sent';
        newRevWrapper.innerHTML = 'Review was sent';
    }else{
        newRevWrapper.className = 'notsent-msg';
        newRevWrapper.innerHTML = 'Review is wainting for the newtork reconnection. When network is ready, your review will be submitted';
    }
});


/**
    * Action taken when the network is back on and if we got pending reviews in local storage.
    */
window.addEventListener('online', function(e) {
    if (!dbReviewsQueue) {
        return false;
    } else {
        getAllPostponed().then(function(reviews) {
            return Promise.all(reviews.map(function(rev) {
                return fetch('http://localhost:1337/reviews/', {
                    method: 'POST',
                    body: JSON.stringify(rev),
                    headers: {
                        'content-type': 'application/json'
                    }
                }).then(function(response) {
                    return response.json();
                }).then(function() {

                    deletePostponed(rev.id);
                    console.log('Your review has been submitted to the server. If any review was pending, it has also been sent');
                })
            })
            )
        }).catch(function(err) { console.error(err); })
    }

});
