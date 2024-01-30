document.addEventListener('DOMContentLoaded', function() {
    window.location.href='#'
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
                            const featuredMovie = document.querySelector('.featured-movie');
                            const playButton = featuredMovie.querySelector('.featured-movie-layout .play-button');
                            movieId = movieData.id;
                            featuredMovie.dataset.id = movieId
                            featuredMovieSummary.textContent = movieSummary;
                            playButton.href = `#modal-${movieId}`;
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

    async function fetchAndInsertImages(apiUrl, carouselSelector, totalAdded = 0) {
        try {
            const response = await fetch(apiUrl);
            const data = await response.json();

            const carousel = document.querySelector(carouselSelector);
            const items = carousel.querySelectorAll('.item');

            for (let i = 0; totalAdded < 7 && i < data.results.length; i++) {
                const movie = data.results[i];
                const item = items[totalAdded];
                const movieId = movie.id;
                const imageUrl = movie.image_url;
                const movieTitle = movie.title;
                const imageExists = await doesImageExist(imageUrl);

                const anchor = item.querySelector('.btn');
                const img = anchor.querySelector('img');

                item.title = `${movieTitle}`;
                item.dataset.id = movieId;
                anchor.href = `#modal-${movieId}`;
                img.src = imageExists ? imageUrl : 'https://media.istockphoto.com/id/1221750570/vector/exclamation-mark-sign-warning-about-an-emergency.jpg?s=612x612&w=0&k=20&c=EsKL2jyoS_T06mQuX6_mbhPF6qqkrO48v9L9YsOe-Eo=';
                img.alt = `${movieTitle}`;

                totalAdded++;
            }

            if (totalAdded < 7 && data.next) {
                await fetchAndInsertImages(data.next, carouselSelector, totalAdded);
            }

        } catch (error) {
            console.error('Erreur lors de la récupération des images :', error);
        }
    }

    async function doesImageExist(url) {
        try {
            const response = await fetch(url, { method: 'HEAD' });
            return response.ok;
        } catch (error) {
            return false;
        }
    }

    function openModal() {
        let items = document.querySelectorAll('.carousel .item');
        const modal = document.querySelector('#modal')
    
        for (const item of items) {
            item.addEventListener('click', () => {
                let itemId = item.getAttribute('data-id')
    
                
                modal.setAttribute('id', `modal-${itemId}`)
                modal.dataset.id = itemId;
                displayMovieInfos(itemId);
            });
        };
        let playButton = document.querySelector('.featured-movie-layout .play-button');
        playButton.addEventListener('click', () => {

            let featuredMovie = document.querySelector('.featured-movie');
            let featuredMovieId = featuredMovie.dataset.id
            
            modal.setAttribute('id', `modal-${featuredMovieId}`);
            modal.dataset.id = featuredMovieId;
            displayMovieInfos(featuredMovieId);
        }
    );
        
    }
    function displayMovieInfos(modalId) {

        const modal = document.querySelector('.modal');

        if (!modalId) {
            console.error('L\'élément .modal n\'a pas d\'attribut data-id défini.');
            return;
        }
        const movieUrl = `http://localhost:8000/api/v1/titles/${modalId}`;

        fetch(movieUrl)
            .then(response => response.json())
            .then(movieData => {
                const movieImage = modal.querySelector('.movie-image img')
                const movieTitle = modal.querySelector('#movie-title-content');
                const movieGenre = modal.querySelector('#movie-genre-content');
                const movieReleaseDate = modal.querySelector('#movie-release-date-content');
                const movieRating = modal.querySelector('#movie-rating-content');
                const movieImdb = modal.querySelector('#movie-imdb-score-content');
                const movieDirector = modal.querySelector('#movie-director-content');
                const movieCast = modal.querySelector('#movie-cast-content');
                const movieDuration = modal.querySelector('#movie-duration-content');
                const movieCountry = modal.querySelector('#movie-country-content');
                const movieBoxOffice = modal.querySelector('#movie-box-office-content');
                const movieSummary = modal.querySelector('#movie-summary-content');

                movieImage.getAttribute('src');
                movieImage.src = movieData.image_url;
                movieTitle.textContent = movieData.title;
                movieGenre.textContent = movieData.genres;
                movieReleaseDate.textContent = movieData.date_published;
                movieRating.textContent = movieData.rated;
                movieImdb.textContent = movieData.imdb_score;
                movieDirector.textContent = movieData.directors;
                movieCast.textContent = movieData.actors;
                movieDuration.textContent = movieData.duration;
                movieCountry.textContent = movieData.countries;
                movieBoxOffice.textContent = movieData.worldwide_gross_income;
                movieSummary.textContent = movieData.long_description;
            })
    }
    openModal()

    function closeModal(){
        let modal = document.querySelector('.modal')
        const closeButton = modal.querySelector('.close a i')
        closeButton.addEventListener('click', () => {
            modal.setAttribute('id', "modal")
        })
    }
    closeModal()
    fetchAndInsertImages("http://localhost:8000/api/v1/titles/?year=&min_year=&max_year=&imdb_score=&imdb_score_min=&imdb_score_max=&title=&title_contains=&genre=&genre_contains=&sort_by=-imdb_score&director=&director_contains=&writer=&writer_contains=&actor=&actor_contains=&country=&country_contains=&lang=&lang_contains=&company=&company_contains=&rating=&rating_contains=", '.category.best-rated .carousel');
    fetchAndInsertImages("http://localhost:8000/api/v1/titles/?year=&min_year=&max_year=&imdb_score=&imdb_score_min=&imdb_score_max=&title=&title_contains=&genre=Action&genre_contains=&sort_by=-imdb_score&director=&director_contains=&writer=&writer_contains=&actor=&actor_contains=&country=&country_contains=&lang=&lang_contains=&company=&company_contains=&rating=&rating_contains=", '.category.action .carousel');
    fetchAndInsertImages("http://localhost:8000/api/v1/titles/?year=&min_year=&max_year=&imdb_score=&imdb_score_min=&imdb_score_max=&title=&title_contains=&genre=Adventure&genre_contains=&sort_by=-imdb_score&director=&director_contains=&writer=&writer_contains=&actor=&actor_contains=&country=&country_contains=&lang=&lang_contains=&company=&company_contains=&rating=&rating_contains=", '.category.adventure .carousel', 0);
    fetchAndInsertImages("http://localhost:8000/api/v1/titles/?year=&min_year=&max_year=&imdb_score=&imdb_score_min=&imdb_score_max=&title=&title_contains=&genre=Comedy&genre_contains=&sort_by=-imdb_score&director=&director_contains=&writer=&writer_contains=&actor=&actor_contains=&country=&country_contains=&lang=&lang_contains=&company=&company_contains=&rating=&rating_contains=", '.category.comedy .carousel');
});
