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
        carouselList.scrollLeft -= carouselList.clientWidth;
    });
    
    scrollRightButton.addEventListener('click', () => {
        carouselList.scrollLeft += carouselList.clientWidth;
    });
}

setupCarousel('.category.best-rated');
setupCarousel('.category.action');
setupCarousel('.category.adventure');
setupCarousel('.category.comedy');

async function fetchAndInsertImages(apiUrl, carouselSelector) {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        const carousel = document.querySelector(carouselSelector);
        const images = [];

        for (let i = 0; i < 7 && i < data.results.length; i++) {
            const movie = data.results[i];
            const movieId = movie.id; 
            images.push(`<li class="item" title="Film 5" data-id="${movieId}">
                            <a class="btn" href="#modal">
                                <img src="${movie.image_url}" alt="Film ${i + 1}">
                            </a>
                        </li>`);
        }

        if (images.length < 7 && data.next) {
            const nextPageResponse = await fetch(data.next);
            const nextPageData = await nextPageResponse.json();

            for (let i = 0; images.length < 7 && i < nextPageData.results.length; i++) {
                const movie = nextPageData.results[i];
                const movieId = movie.id; 
                images.push(`<li class="item" title="Film 5" data-id="${movieId}">
                            <a class="btn" href="#modal">
                                <img src="${movie.image_url}" alt="Film ${i + 1}">
                            </a>
                        </li>`);
            }
        }

        carousel.innerHTML = images.join('');
    } catch (error) {
        console.error('Erreur lors de la récupération des images :', error);
    }
}

fetchAndInsertImages("http://localhost:8000/api/v1/titles/?year=&min_year=&max_year=&imdb_score=&imdb_score_min=&imdb_score_max=&title=&title_contains=&genre=&genre_contains=&sort_by=-imdb_score&director=&director_contains=&writer=&writer_contains=&actor=&actor_contains=&country=&country_contains=&lang=&lang_contains=&company=&company_contains=&rating=&rating_contains=", '.category.best-rated .carousel');
fetchAndInsertImages("http://localhost:8000/api/v1/titles/?year=&min_year=&max_year=&imdb_score=&imdb_score_min=&imdb_score_max=&title=&title_contains=&genre=Action&genre_contains=&sort_by=-imdb_score&director=&director_contains=&writer=&writer_contains=&actor=&actor_contains=&country=&country_contains=&lang=&lang_contains=&company=&company_contains=&rating=&rating_contains=", '.category.action .carousel');
fetchAndInsertImages("http://localhost:8000/api/v1/titles/?year=&min_year=&max_year=&imdb_score=&imdb_score_min=&imdb_score_max=&title=&title_contains=&genre=Adventure&genre_contains=&sort_by=-imdb_score&director=&director_contains=&writer=&writer_contains=&actor=&actor_contains=&country=&country_contains=&lang=&lang_contains=&company=&company_contains=&rating=&rating_contains=", '.category.adventure .carousel');
fetchAndInsertImages("http://localhost:8000/api/v1/titles/?year=&min_year=&max_year=&imdb_score=&imdb_score_min=&imdb_score_max=&title=&title_contains=&genre=Comedy&genre_contains=&sort_by=-imdb_score&director=&director_contains=&writer=&writer_contains=&actor=&actor_contains=&country=&country_contains=&lang=&lang_contains=&company=&company_contains=&rating=&rating_contains=", '.category.comedy .carousel');

