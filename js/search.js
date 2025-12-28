const play_song = document.getElementById("play-song");
const btn = document.getElementById("btn");
const songBar = document.getElementById("Song-Bar");
const songList = document.getElementById("song-list");
const searchInput = document.getElementById("searchInput");

let songs = [];

// 🔹 CARICAMENTO CANZONI
fetch("data/songs.json")
  .then(res => res.json())
  .then(data => {
    songs = data;
    console.log("Canzoni caricate:", songs);
  })
  .catch(err => console.error("Errore JSON:", err));

// 🔹 RICERCA LIVE
searchInput.addEventListener("input", () => {
  const q = searchInput.value.toLowerCase().trim();
  if (!q) {
    songList.innerHTML = "";
    return;
  }

  const results = songs.filter(song =>
    song.title.toLowerCase().includes(q) ||
    song.artist.toLowerCase().includes(q)
  );

  renderSongs(results.slice(0, 20));
});

// 🔹 MOSTRA CANZONI
function renderSongs(list) {
  songList.innerHTML = "";
  list.forEach(song => {
    const item = document.createElement("div");
    item.className = "song-item";
    item.innerHTML = `
      <img src="${song.cover}" class="song-cover">
      <div class="song-info">
        <span class="song-title">${song.title}</span>
        <span class="song-artist">${song.artist}</span>
      </div>
      <div class="song-options"><button>⋮</button></div>
    `;
    item.onclick = () => playTrack(song);
    songList.appendChild(item);
  });
}

// 🔹 PLAYER
function playTrack(song) {
  songBar.style.display = "flex";
  document.getElementById("song-title").innerText = song.title;
  document.getElementById("song-artist").innerText = song.artist;
  document.getElementById("song-img").src = song.cover;

  if (!play_song.src.includes(song.file)) {
    play_song.src = song.file;
    play_song.load();
  }

  play_song.play();
  btn.innerText = "⏸";
}

// 🔹 PLAY / PAUSA
function togglePlay() {
  if (play_song.paused) {
    play_song.play();
    btn.innerText = "⏸";
  } else {
    play_song.pause();
    btn.innerText = "▶";
  }
}

// 🔹 PROGRESS BAR
const progress = document.querySelector(".progress");
const progressContainer = document.querySelector(".progress-container");

play_song.addEventListener("timeupdate", () => {
  if (!play_song.duration) return;
  const percent = (play_song.currentTime / play_song.duration) * 100;
  progress.style.width = percent + "%";
});

progressContainer.addEventListener("click", e => {
  play_song.currentTime =
    (e.offsetX / progressContainer.clientWidth) * play_song.duration;
});
