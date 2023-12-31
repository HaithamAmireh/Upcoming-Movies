const main = document.querySelector("#main-card");
const loading = document.querySelector("#loading")
const youtubeUrl = "https://www.youtube.com/watch?v=";
async function getAPIToken() {
  const response = await fetch("https://vn5jmtgrikr32anxjvfetdykci0hekmw.lambda-url.us-east-1.on.aws/")
  const apiToken = await response.json()
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: "Bearer " + apiToken,
    },
  };
  return options
}

async function fetchConfig() {
  const options = await getAPIToken()
  const response = await fetch(
    "https://api.themoviedb.org/3/configuration",
    options
  );
  const configData = await response.json();
  const baseUrl = configData.images.base_url;
  const posterSize = configData.images.poster_sizes[3];
  return [baseUrl, posterSize];
}

async function fetchUpcomingMovies() {
  const options = await getAPIToken()
  const res = await fetch(
    "https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&primary_release_year=2023&primary_release_date.gte=2023-11-01&primary_release_date.lte=2024-12-31&sort_by=popularity.desc",
    options
  );
  const moviesData = await res.json();
  return moviesData.results;
}

async function fetchMovieTrailer(movie_id) {
  const options = await getAPIToken()
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/${movie_id}/videos?language=en-US`,
    options
  );
  const movieVideos = await response.json();
  const filteredResults = movieVideos.results.filter(result => {
    const lowerCaseType = result.type ? result.type.toLowerCase() : '';
    const lowerCaseName = result.name ? result.name.toLowerCase() : '';
    return lowerCaseType.includes('trailer') && lowerCaseName.includes('trailer');
  });
  const finalResult = filteredResults.length > 0 ? filteredResults[0] : movieVideos.results[0];
  return finalResult.key;
}

async function listUpcomingMovies() {
  try {
    const config = await fetchConfig();
    const movies = await fetchUpcomingMovies();
    movies.forEach(async (movie) => {
      const trailer = await fetchMovieTrailer(movie.id);
      let img = document.createElement("img");
      let container = document.createElement("div");
      let title = document.createElement("p");
      let releaseDate = document.createElement("p")
      let anchor = document.createElement("a");
      let showTrailer = document.createElement("p")
      let movieInfo = document.createElement("div")
      releaseDate.innerText = `| ${movie.release_date} `
      showTrailer.innerText = "Show Trailer"
      showTrailer.classList.add("hover-text")
      title.classList.add("title")
      anchor.href = `${youtubeUrl}${trailer}`;
      img.src = `${config[0]}/${config[1]}/${movie.poster_path}`;
      img.classList.add("poster")
      title.textContent = movie.original_title
      movieInfo.appendChild(title)
      movieInfo.appendChild(releaseDate)
      movieInfo.classList.add("movieInfo")
      anchor.appendChild(showTrailer)
      anchor.target = "_blank";
      container.appendChild(anchor);
      container.appendChild(img);
      container.appendChild(movieInfo);
      container.classList.add("container");
      main.appendChild(container);
      loading.classList.remove("showLoading")
      loading.classList.add("hideLoading")
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    loading.classList.remove("showLoading")
  }
}
listUpcomingMovies();
