var favCheckbox = document.getElementById('favorite-checkbox');
var optainID = document.getElementById('favoriteTask');
let idRestaurant;
let checkboxState;

// favCheckbox.addEventListener('change', () => {
//     idRestaurant = optainID.dataset.id;
//
//     if(!favCheckbox.checked){
//         SetRestaurantAsFavorite(idRestaurant)
//     }else{
//         UnsetSetRestaurantAsFavorite(idRestaurant)
//     }
//
// });

function switchFav(checkbox) {
    idRestaurant = optainID.dataset.id;

    if(checkbox.checked){
        UnsetSetRestaurantAsFavorite(idRestaurant)
    }else{
        SetRestaurantAsFavorite(idRestaurant)
    }
}


function SetRestaurantAsFavorite(id) {
    return fetch(`http://localhost:1337/restaurants/${id}?is_favorite=false`, {
        method: "PUT",
        "content-type": "application/json"
    }).then(function(response) {
        if (response.ok) {
            return response.json();
        }
    }).then(function() {
        console.log('setted as favorite')
        updateRestaurantsData()
    }).catch(err => {
        console.error('Failed to set as favorite', err);
        return null;
    });
}

function UnsetSetRestaurantAsFavorite(id) {

    return fetch(`http://localhost:1337/restaurants/${id}/?is_favorite=true`,
        {
            method: "PUT",
            "content-type": "application/json"
        }
    ).then(function(response) {
        if (response.ok) {
            return response.json();
        }
    }).then(function() {
        console.log('unsetted as favorite');
        updateRestaurantsData
    }).then(
        //pune toate restaurantele in idb
    )

    .catch(err => {
        console.error('Failed to set as favorite', err);
        return null;
    });
}



function updateRestaurantsData() {
    fetch('http://localhost:1337/restaurants', {
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
    }).catch(error => {
        console.log('Problem with your restaurant fetch operation: ', error.message);
    })
}
