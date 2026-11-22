export function requestGamePointerLock() {
    if (typeof document === "undefined") {
        return;
    }

    const canvas = document.querySelector<HTMLCanvasElement>(".app canvas");
    canvas?.requestPointerLock?.();
}

export function exitGamePointerLock() {
    if (typeof document !== "undefined" && document.pointerLockElement) {
        document.exitPointerLock?.();
    }
}
