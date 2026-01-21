const API_KEY = "AIzaSyBMNIx8X3XmR_gMrTIrX-0NL5NQSDEPDKU";
let player;
let currentSong = null;

async function loadPublic() {
    const current = JSON.parse(localStorage.getItem("current"));
    const list = JSON.parse(localStorage.getItem("playlist")) || [];

    document.getElementById("now").textContent =
        current ? `🎤 Sada pjeva: Stol ${current.table} – ${current.song}` : "🎤 Sada pjeva: —";

    document.getElementById("next").textContent =
        list[0] ? `➡️ Sljedeći: Stol ${list[0].table} – ${list[0].song}` : "➡️ Sljedeći: —";

    if (!current) return;

    // ako se promijenila pjesma -> učitaj novi video
    if (current.song !== currentSong) {
        currentSong = current.song;

        const q = encodeURIComponent(current.song + " karaoke");
        const r = await fetch(
            `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=1&q=${q}&key=${API_KEY}`
        );
        const d = await r.json();
        const videoId = d.items[0].id.videoId;

        if (!player) {
            player = new YT.Player("video", {
                height: "400",
                width: "100%",
                videoId: videoId,
                playerVars: { autoplay: 1, controls: 0 },
                events: { onStateChange: onPlayerStateChange }
            });
        } else {
            player.loadVideoById(videoId);
        }
    }
}

function onPlayerStateChange(event) {
    // 0 = video je završio
    if (event.data === 0) {
        // reload nakon što se pjesma završi
        location.reload();
    }
}

// update svake 3 sekunde da vidi promjene od admina
setInterval(loadPublic, 3000);
