const API_KEY = "AIzaSyBMNIx8X3XmR_gMrTIrX-0NL5NQSDEPDKU";
let player;

function onYouTubeIframeAPIReady() {
    loadVideo();
}

async function loadVideo() {
    const current = JSON.parse(localStorage.getItem("current"));
    const list = JSON.parse(localStorage.getItem("playlist")) || [];

    document.getElementById("now").textContent =
        current ? `🎤 Sada pjeva: Stol ${current.table} – ${current.song}` : "🎤 Sada pjeva: —";

    document.getElementById("next").textContent =
        list[0] ? `➡️ Sljedeći: Stol ${list[0].table} – ${list[0].song}` : "➡️ Sljedeći: —";

    if (!current) return;

    const videoId = await getVideoId(current.song);

    // Kreiraj player ako ne postoji
    if (!player) {
        player = new YT.Player("video", {
            height: "400",
            width: "100%",
            videoId: videoId,
            playerVars: { autoplay: 1, controls: 0 }
        });
    } else {
        player.loadVideoById(videoId);
    }
}

async function getVideoId(song) {
    const q = encodeURIComponent(song + " karaoke");
    const r = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=1&q=${q}&key=${API_KEY}`
    );
    const d = await r.json();
    return d.items[0].id.videoId;
}

// Kad admin klikne next, current se promijeni u localStorage
// Public prati promjenu preko storage event
window.addEventListener("storage", () => {
    loadVideo();
});

