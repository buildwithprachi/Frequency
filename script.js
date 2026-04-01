const loadingText = document.getElementById("loading-text");

fetch("https://ws.audioscrobbler.com/2.0/?method=chart.gettoptracks&api_key=d402af4ac778c80e291788f839c5920f&format=json")
  .then(res => res.json())
  .then(data => {
    const list = data.tracks.track;
    loadingText.style.display = "none";
    displayAlbum(list);
  })
  .catch(err => {
    loadingText.innerText = "Failed to load data.";
  });

function displayAlbum(list) {
  const container = document.getElementById("album-container");
  container.innerHTML = "";

  list.forEach(track => {
    const image = track.image?.[2]?.["#text"] || "https://via.placeholder.com/150";

    const card = `
      <div class="card">
        <img src="${image}" alt="${track.name}">
        <h3>${track.name}</h3>
        <p>${track.artist.name}</p>
      </div>
    `;

    container.innerHTML += card;
  });
}