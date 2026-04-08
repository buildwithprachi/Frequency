const API_KEY = "d402af4ac778c80e291788f839c5920f";
const container = document.getElementById("album-container");
let allTracks = [];
let filteredTracks = [];

fetch(`https://ws.audioscrobbler.com/2.0/?method=geo.gettoptracks&country=united+states&api_key=${API_KEY}&format=json`)
.then(res => res.json())
  .then(data => {
    const list = data.tracks.track;
    allTracks = data.tracks.track;
    filteredTracks = allTracks;
    displayAlbum(filteredTracks);
    document.getElementById("loading-text").style.display = "none";
    displayAlbum(list);
  })
  .catch(err => {
    document.getElementById("loading-text").innerText = "Error loading songs.";
  });

async function displayAlbum(list) {
  container.innerHTML = "";

  list.map(async (track) => { 
    const imageUrl = await getItunesCover(track.name, track.artist.name);

    const card = `
      <div class="card">
        <img src="${imageUrl}" alt="${track.name}" loading="lazy">
        <h3>${track.name}</h3>
        <p>${track.artist.name}</p>
        <button onclick="toggleFav(this)">❤️</button>
      </div>
    `;
    container.insertAdjacentHTML('beforeend', card);
  })
}

async function getItunesCover(song, artist) {
  try {

    const query = encodeURIComponent(`${song} ${artist}`);
    const res = await fetch(`https://itunes.apple.com/search?term=${query}&entity=song&limit=1`);
    const data = await res.json();
    
    if (data.results && data.results.length > 0) {
      return data.results[0].artworkUrl100.replace("100x100", "600x600");
    }

    return "https://via.placeholder.com/300/222222/ffffff?text=No+Cover";
  } catch (error) {
    return "https://via.placeholder.com/300/222222/ffffff?text=Error";
  }
}

document.getElementById("search-input").addEventListener("input", function () {
  const query = this.value.toLowerCase();

  filteredTracks = allTracks.filter(track =>
    track.name.toLowerCase().includes(query)
  );

  displayAlbum(filteredTracks);
});

document.getElementById("sort-select").addEventListener("change", function () {
  const value = this.value;

  let sorted = [...filteredTracks];

  if (value === "az") {
    sorted.sort((a, b) => a.name.localeCompare(b.name));
  } else if (value === "za") {
    sorted.sort((a, b) => b.name.localeCompare(a.name));
  }

  displayAlbum(sorted);
});

document.getElementById("artist-filter").addEventListener("input", function () {
  const artistQuery = this.value.toLowerCase();

  filteredTracks = allTracks.filter(track =>
    track.artist.name.toLowerCase().includes(artistQuery)
  );

  displayAlbum(filteredTracks);
});

function toggleFav(btn) {
  btn.classList.toggle("active");
}

function toggleTheme() {
  document.body.classList.toggle("dark");
}