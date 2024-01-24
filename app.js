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
                const imageExists = await doesImageExist(imageUrl);

                const anchor = item.querySelector('.btn');
                const img = anchor.querySelector('img');

                item.title = `Film ${movieId}`;
                item.dataset.id = movieId;
                anchor.href = `#modal-${movieId}`;
                img.src = imageExists ? imageUrl : 'C:\\Users\\Cleme\\OneDrive\\Images\\zouinw.jpg';
                img.alt = `Film ${movieId}`;

                totalAdded++;
            }

            if (totalAdded < 7 && data.next) {
                await fetchAndInsertImages(data.next, carouselSelector, totalAdded);
            }

        } catch (error) {
            console.error('Erreur lors de la récupération des images :', error);
        }
    }



    fetchAndInsertImages("http://localhost:8000/api/v1/titles/?year=&min_year=&max_year=&imdb_score=&imdb_score_min=&imdb_score_max=&title=&title_contains=&genre=&genre_contains=&sort_by=-imdb_score&director=&director_contains=&writer=&writer_contains=&actor=&actor_contains=&country=&country_contains=&lang=&lang_contains=&company=&company_contains=&rating=&rating_contains=", '.category.best-rated .carousel');
    fetchAndInsertImages("http://localhost:8000/api/v1/titles/?year=&min_year=&max_year=&imdb_score=&imdb_score_min=&imdb_score_max=&title=&title_contains=&genre=Action&genre_contains=&sort_by=-imdb_score&director=&director_contains=&writer=&writer_contains=&actor=&actor_contains=&country=&country_contains=&lang=&lang_contains=&company=&company_contains=&rating=&rating_contains=", '.category.action .carousel');
    fetchAndInsertImages("http://localhost:8000/api/v1/titles/?year=&min_year=&max_year=&imdb_score=&imdb_score_min=&imdb_score_max=&title=&title_contains=&genre=Adventure&genre_contains=&sort_by=-imdb_score&director=&director_contains=&writer=&writer_contains=&actor=&actor_contains=&country=&country_contains=&lang=&lang_contains=&company=&company_contains=&rating=&rating_contains=", '.category.adventure .carousel', 0);
    fetchAndInsertImages("http://localhost:8000/api/v1/titles/?year=&min_year=&max_year=&imdb_score=&imdb_score_min=&imdb_score_max=&title=&title_contains=&genre=Comedy&genre_contains=&sort_by=-imdb_score&director=&director_contains=&writer=&writer_contains=&actor=&actor_contains=&country=&country_contains=&lang=&lang_contains=&company=&company_contains=&rating=&rating_contains=", '.category.comedy .carousel');

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
            });
        };
        
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
});