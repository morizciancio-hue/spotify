const play_song = document.getElementById("play-song");
const btn = document.getElementById("btn");
const songBar = document.getElementById("Song-Bar");
const songList = document.getElementById("song-list");
const searchInput = document.getElementById("searchInput");
const progress = document.querySelector(".progress");

let songs = [];

/* 🔹 CARICA CANZONI */
fetch("data/songs.json")
  .then(res => res.json())
  .then(data => songs = data);

/* 🔹 ESTRAE ALBUM UNICI */
function getAlbums() {
  const map = new Map();

  songs.forEach(song => {
    if (song.albumId && !map.has(song.albumId)) {
      map.set(song.albumId, {
        albumId: song.albumId,
        albumName: song.albumName,
        cover: song.cover,
        artist: song.artist
      });
    }
  });

  return Array.from(map.values());
}

/* 🔹 RICERCA LIVE */
searchInput.addEventListener("input", () => {
  const q = searchInput.value.toLowerCase().trim();
  songList.innerHTML = "";

  if (!q) return;

  const albums = getAlbums().filter(a =>
    a.albumName.toLowerCase().includes(q) ||
    a.artist.toLowerCase().includes(q)
  );

  const songResults = songs.filter(s =>
    s.title.toLowerCase().includes(q) ||
    s.artist.toLowerCase().includes(q)
  );

  if (albums.length) renderAlbums(albums);
  if (songResults.length) renderSongs(songResults.slice(0, 20));

  if (!albums.length && !songResults.length) {
    songList.innerHTML = "<p style='padding:16px'>Nessun risultato</p>";
  }
});

/* 🔹 MOSTRA ALBUM */
function renderAlbums(albums) {
  const title = document.createElement("h4");
  title.innerText = "Album";
  title.style.padding = "12px 16px";
  title.style.color = "#b3b3b3";
  songList.appendChild(title);

  albums.forEach(album => {
    const item = document.createElement("div");
    item.className = "song-item";
    item.innerHTML = `
      <img src="${album.cover}" class="song-cover">
      <div class="song-info">
        <span class="song-title">${album.albumName}</span>
        <span class="song-artist">Album • ${album.artist}</span>
      </div>
    `;
    item.onclick = () => {
      window.location.href = `album.html?album=${album.albumId}`;
    };
    songList.appendChild(item);
  });
}

/* 🔹 MOSTRA CANZONI */
function renderSongs(list) {
  const title = document.createElement("h4");
  title.innerText = "Canzoni";
  title.style.padding = "12px 16px";
  title.style.color = "#b3b3b3";
  songList.appendChild(title);

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

/* 🔹 PLAYER */
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

/* 🔹 PLAY / PAUSA */
function togglePlay() {
  if (play_song.paused) {
    play_song.play();
    btn.innerHTML = '<i class="fas fa-pause"></i>';
  } else {
    play_song.pause();
    btn.innerHTML = '<i class="fas fa-play"></i>';
  }
}

/* 🔹 PROGRESS */
play_song.addEventListener("timeupdate", () => {
  if (!play_song.duration) return;
  progress.style.width =
    (play_song.currentTime / play_song.duration) * 100 + "%";
});
