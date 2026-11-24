import gunfireUrl from "~/resources/sound/gun-shot-359196.mp3";

const shotsPool = typeof Audio === "undefined"
    ? []
    : Array.from({ length: 4 }, () => {
        const shotAudio = new Audio(gunfireUrl);
        shotAudio.preload = "auto";
        shotAudio.volume = 0.2;
        return shotAudio;
    });

let nextShot = 0;

export function playGunfireSound() {
    const currentShot = shotsPool[nextShot];
    if (!currentShot) return;

    nextShot = (nextShot + 1) % shotsPool.length;
    currentShot.currentTime = 0;
    void currentShot.play().catch(() => undefined);
}
