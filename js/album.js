const play_song = document.getElementById("play-song");
const btn = document.getElementById("btn");
const songBar = document.getElementById("Song-Bar");
const songList = document.getElementById("song-list");
const progress = document.querySelector(".progress");

// 🔹 legge album dall'URL
const params = new URLSearchParams(window.location.search);
const albumId = params.get("album");

// 🔹 carica canzoni
fetch("data/songs.json")
  .then(res => res.json())
  .then(data => {
    const albumSongs = data.filter(song => song.albumId === albumId);
    renderAlbum(albumSongs);
    setAlbumInfo(albumSongs[0]);
  })
  .catch(err => console.error(err));

// 🔹 rende la lista delle canzoni
function renderAlbum(list) {
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

// 🔹 imposta informazioni album + gradient sotto l’album
function setAlbumInfo(song) {
  if (!song) return;

  const albumTitle = document.querySelector(".title span");
  const albumImg = document.querySelector(".img");
  const albumSection = document.querySelector(".image");

  albumTitle.innerText = song.albumName;
  albumImg.src = song.cover;

  // Gradiente sfondo per album
  const albumGradients = {
    "tutta-vita": "linear-gradient(to bottom, #afffbaff, #121212)",
    "anima-nera": "linear-gradient(to bottom, #4d98b4ff, #121212)",
    "locura": "linear-gradient(to bottom, #323230ff, #121212)",
    // aggiungi altri album qui
  };

  albumSection.style.background = albumGradients[song.albumId] || "linear-gradient(to bottom, #121212, #121212)";
}

// 🔹 funzione per riprodurre una canzone
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
  btn.innerHTML = '<i class="fas fa-pause"></i>';
}

// 🔹 toggle play/pause
function togglePlay() {
  if (play_song.paused) {
    play_song.play();
    btn.innerHTML = '<i class="fas fa-pause"></i>';
  } else {
    play_song.pause();
    btn.innerHTML = '<i class="fas fa-play"></i>';
  }
}

// 🔹 aggiorna barra progresso
play_song.addEventListener("timeupdate", () => {
  if (!play_song.duration) return;
  progress.style.width =
    (play_song.currentTime / play_song.duration) * 100 + "%";
});
