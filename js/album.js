const play_song = document.getElementById("play-song");
const btn = document.getElementById("btn");
const songBar = document.getElementById("Song-Bar");
const songList = document.getElementById("song-list");

let allSongs = [];


fetch("data/songs.json")
  .then(res => res.json())
  .then(data => {
    allSongs = data;
    const albumSongs = allSongs.filter(song => song.album === "Tutta Vita" || song.artist === "Olly");
    renderAlbum(albumSongs);
  })
  .catch(err => console.error("Errore nel caricamento del JSON:", err));

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

function playTrack(song) {
  songBar.style.display = "flex";
  document.getElementById("song-title").innerText = song.title;
  document.getElementById("song-artist").innerText = song.artist;
  document.getElementById("song-img").src = song.cover;

  if (!play_song.src.includes(encodeURIComponent(song.file))) {
    play_song.src = song.file;
    play_song.load();
  }

  play_song.play();
  btn.innerHTML = '<i class="fas fa-pause"></i>';
}

function togglePlay() {
  if (play_song.paused) {
    play_song.play();
    btn.innerHTML = '<i class="fas fa-pause"></i>';
  } else {
    play_song.pause();
    btn.innerHTML = '<i class="fas fa-play"></i>';
  }
}

const progress = document.querySelector(".progress");
play_song.addEventListener("timeupdate", () => {
  if (!play_song.duration) return;
  const percent = (play_song.currentTime / play_song.duration) * 100;
  progress.style.width = percent + "%";
});

document.querySelector(".progress-container").addEventListener("click", e => {
  play_song.currentTime = (e.offsetX / e.currentTarget.clientWidth) * play_song.duration;
});