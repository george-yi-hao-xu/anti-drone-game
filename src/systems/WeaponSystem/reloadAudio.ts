import reloadUrl from "~/resources/sound/reload.mp3";

const reloadAudio = typeof Audio === "undefined" ? null : new Audio(reloadUrl);

if (reloadAudio) {
    reloadAudio.preload = "auto";
    reloadAudio.volume = 0.4;
}

export function playReloadSound() {
    if (!reloadAudio) return;

    reloadAudio.currentTime = 0;
    void reloadAudio.play().catch(() => undefined);
}
