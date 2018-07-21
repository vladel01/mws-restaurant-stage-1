var favCheckbox = document.getElementById('favorite-checkbox');
var optainID = document.getElementById('favoriteTask');
let idRestaurant;

favCheckbox.addEventListener('change', () => {
    idRestaurant = optainID.dataset.id;

    if(favCheckbox.checked){
        UnsetSetRestaurantAsFavorite(idRestaurant)
    }
    else{
        SetRestaurantAsFavorite(idRestaurant)
    }
})

function SetRestaurantAsFavorite(id) {

    return fetch(`http://localhost:1337/restaurants/${id}/?is_favorite=false`,
        {
            method: "PUT",
            "content-type": "application/json"
        }
    ).then(function(response) {
        if (response.ok) {
            return response.json();
        }
    }).then(
        //get toate restaurantele pt idb
    ).then(
        //pune toate restaurantele in idb
    )

    .catch(err => {
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
            console.log(response);
        }
    }).then(
        //get toate restaurantele pt idb
    ).then(
        //pune toate restaurantele in idb
    )

    .catch(err => {
        console.error('Failed to set as favorite', err);
        return null;
    });
}
