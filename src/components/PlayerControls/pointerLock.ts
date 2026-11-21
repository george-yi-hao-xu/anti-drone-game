export function requestGamePointerLock() {
    if (typeof document === "undefined") {
        return;
    }

    const canvas = document.querySelector<HTMLCanvasElement>(".app canvas");
    canvas?.requestPointerLock?.();
}
