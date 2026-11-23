const DROP_END = 0.34;
const HOLD_END = 0.62;

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

const smoothStep = (value: number) => {
    const progress = clamp01(value);
    return progress * progress * (3 - 2 * progress);
};

export function getReloadHandTravel(
    elapsed: number,
    reloadEnd: number,
    reloadDuration: number,
    reloading: boolean,
) {
    if (!reloading || reloadDuration <= 0) {
        return 0;
    }

    const reloadStart = reloadEnd - reloadDuration;
    const progress = clamp01((elapsed - reloadStart) / reloadDuration);

    if (progress < DROP_END) {
        return smoothStep(progress / DROP_END);
    }

    if (progress < HOLD_END) {
        return 1;
    }

    return 1 - smoothStep((progress - HOLD_END) / (1 - HOLD_END));
}
