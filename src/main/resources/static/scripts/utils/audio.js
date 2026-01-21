let currentAudio = null;

// Plays the audio of the given source, and stops any already playing audio.
export function playAudio(src) {
    if (!src) return;

    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
    }

    currentAudio = new Audio(src);

    // Increase volume for cached kanji audio (they initially have low volume)
    if (src.startsWith("http://localhost:8080/cache/audio_cache/")) {
        const ctx = new AudioContext();
        const source = ctx.createMediaElementSource(currentAudio);
        const gainNode = ctx.createGain();
        gainNode.gain.value = 4;
        source.connect(gainNode).connect(ctx.destination);
    }

    currentAudio.play().catch(() => {});
}

// Adds Click event listeners to all audio symbols in the current DOM,
// and binds them with the playAudio function assuming they all have "data-audio" attribute.
export function bindAudioSymbols() {
    document.querySelectorAll(".audio-symbol").forEach(btn => {
        btn.addEventListener("click", () => playAudio(btn.dataset.audio));
    });
}