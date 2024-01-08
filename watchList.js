// function showWatchList() {
//     let watchList = JSON.parse(localStorage.getItem("watchList"));
//     let watchListContainer = document.querySelector("#watch-list-container");
//     watchListContainer.innerHTML = "";
//     watchList.forEach((movie) => {
//         let movieTitle = document.createElement("p");
//         movieTitle.textContent = movie;
//         watchListContainer.appendChild(movieTitle);
//     });
// }

// showWatchList();

// // clear watch list
// let clearButton = document.querySelector("#clear-watch-list");
// clearButton.addEventListener("click", () => {
//     localStorage.clear();
//     showWatchList();
// });

function showWatchList() {
    let watchList = JSON.parse(localStorage.getItem("watchList"));
    let watchListContainer = document.querySelector("#watch-list-container");
    watchListContainer.innerHTML = "";
    watchList.forEach((movie) => {
        let movieContainer = document.createElement("div");

        let title = document.createElement("p");
        title.classList.add("title");
        let titleLink = document.createElement("a");
        titleLink.href = movie.trailerLink;
        titleLink.textContent = movie.title;
        title.appendChild(titleLink);

        movieContainer.appendChild(title);
        watchListContainer.appendChild(movieContainer);
    });
}

showWatchList();

// clear watch list
let clearButton = document.querySelector("#clear-watch-list");
clearButton.addEventListener("click", () => {
    localStorage.clear();
    showWatchList();
});