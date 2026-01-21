const API_KEY = "AIzaSyBMNIx8X3XmR_gMrTIrX-0NL5NQSDEPDKU";
let player;
let currentSong = null;

function onYouTubeIframeAPIReady() {
    loadPublic();
}

async function loadPublic() {
    const current = JSON.parse(localStorage.getItem("current"));
    const list = JSON.parse(localStorage.getItem("playlist")) || [];

    document.getElementById("now").textContent =
        current ? `🎤 Sada pjeva: Stol ${current.table} – ${current.song}` : "🎤 Sada pjeva: —";

    document.getElementById("next").textContent =
        list[0] ? `➡️ Sljedeći: Stol ${list[0].table} – ${list[0].song}` : "➡️ Sljedeći: —";

    if (!current) return;

    if (current.song !== currentSong) {
        currentSong = current.song;

        const videoId = await getVideoId(current.song);

        if (!player) {
            player = new YT.Player("video", {
                height: "400",
                width: "100%",
                videoId: videoId,
                playerVars: {
                    autoplay: 1,
                    controls: 0
                }
            });
        } else {
            player.loadVideoById(videoId);
        }
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

// update samo kad se promijeni current
window.addEventListener("storage", () => {
    loadPublic();
});

loadPublic();
