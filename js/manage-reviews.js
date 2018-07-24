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
            return response.json();
        }

        throw new Error('Network response was not ok, so load form idb');

    }).then(function(reviewsData) {
        fillReviewsHTML(reviewsData);
        addReviewsOneRestaurant(id, reviewsData);
    }).catch(function(error) {
        console.log('There has been a problem with your fetch operation: ', error.message);
        console.log('nu uita sa pui 7 la 1337')
        getReviewsOneRestaurant(id).then(function(cachedReviews) {
            fillReviewsHTML(cachedReviews);
        });
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

        dbReviewsQueue.then(function(db) {
            var trs = db.transaction('PostponedReviews', 'readwrite');
            return trs.objectStore('PostponedReviews').put(review);
        }).then(
            addReview()
        ).then(
            form.reset()
        ).catch(function(err) {
            // something went wrong with the database or the sync registration, log and submit the form
            console.error(err);
        });


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
                           '<p class="review-comment">' + commentValue + '</p>';

            newReview.innerHTML = htmlContent;

            responseContainer.append(newReview);
        }


            getReviewsOneRestaurant(restaurantId).then(function(cachedRevs) {
                cachedRevs.push(review);
                console.log(cachedRevs)

                addReviewsOneRestaurant(restaurantId, cachedRevs);
            });

    };

if (navigator.serviceWorker) {
    navigator.serviceWorker.ready
        .then(reg => {
            form.addEventListener('submit', event => {
                event.preventDefault()

                submitReviews()

                reg.sync.register('PostponedReviews')
                .then(() => {
                    console.log('Review submit was registered')
                })
            })
        })
} else {
    // If no sw supported
    form.addEventListener('submit', event => {
        event.preventDefault()
        console.log('Postponed revs not welcomed - test')

        submitReviews()
    })
}
