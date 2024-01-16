function fetchFeaturedMoviePreview() {
    const sortedMoviesUrl = "http://localhost:8000/api/v1/titles/?year=&min_year=&max_year=&imdb_score=&imdb_score_min=&imdb_score_max=&title=&title_contains=&genre=&genre_contains=&sort_by=-imdb_score&director=&director_contains=&writer=&writer_contains=&actor=&actor_contains=&country=&country_contains=&lang=&lang_contains=&company=&company_contains=&rating=&rating_contains=";

    fetch(sortedMoviesUrl)
        .then(response => response.json())
        .then(data => {
            if (data.results && data.results.length > 0) {
                const imageUrl = data.results[0].image_url;
                const movieImage = document.querySelector('.sub-container img');
                movieImage.src = imageUrl;

                const movieTitle = data.results[0].title;
                const featuredMovieTitle = document.querySelector('.featured-movie-layout h2');
                featuredMovieTitle.textContent = movieTitle

                const featuredMovieUrl = data.results[0].url;

                fetch(featuredMovieUrl)
                .then(secondResponse => secondResponse.json())
                .then(movieData => {
                    const movieSummary = movieData.description;
                    const featuredMovieSummary = document.querySelector('.summary');
                    featuredMovieSummary.textContent = movieSummary
                })

            } else {
                console.error("Aucun résultat trouvé dans la réponse de l'API.");
            }
        })
        .catch(error => {
            console.error("Erreur lors de la récupération des données de l'API :", error);
        });
}

fetchFeaturedMoviePreview();

function setupCarousel(carouselSelector) {
    const carousel = document.querySelector(carouselSelector);
    const carouselList = carousel.querySelector('.carousel');
    const scrollLeftButton = carousel.querySelector('.scroll-left-button');
    const scrollRightButton = carousel.querySelector('.scroll-right-button');

    scrollLeftButton.addEventListener('click', () => {
        const lastItem = carouselList.lastElementChild;
        carouselList.insertBefore(lastItem, carouselList.firstElementChild);
    });

    scrollRightButton.addEventListener('click', () => {
        const firstItem = carouselList.firstElementChild;
        carouselList.appendChild(firstItem);
    });
}

setupCarousel('.category.best-rated');
setupCarousel('.category.action');
setupCarousel('.category.adventure');
setupCarousel('.category.comedy');

