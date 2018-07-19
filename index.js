if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
}

// navigator.serviceWorker.ready.then(function(swRegistration) {
//     return swRegistration.sync.register('myFirstSync');
// });

if (navigator.serviceWorker) {
    navigator.serviceWorker.ready
        .then(reg => {
            const form = document.getElementById('newReview');
            form.addEventListener('submit', event => {
                event.preventDefault();


                reg.sync.register('PostponedReviews')
                .then(() => {
                    console.log('Postponed revs are registered')
                    // ASta merge fie ca e online fie ca e offline,
                    // deci probabil ar trebui sa ma gandesc la reviewurile care intra si in postponed online
                    submitReviews()
                })
            })
        })
} else {
    //const form = document.getElementById('todoForm')
    form.addEventListener('submit', event => {
        event.preventDefault()
        console.log('Postponed revs not welcomed - test')
        
        submitReviews()
    })
}


// LOG:
// idb-ul cu toate revieurile nu este luat la offline. Pe mozzila da eroare la reg si nu pot testa
