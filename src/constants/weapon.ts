export const WEAPON_MODEL_SCALE = 0.5;
export const WEAPON_HIP_POSITION = [0.36, -0.32, -0.82] as const;
export const WEAPON_VIEW_POSITION = [0, -0.12, -0.65] as const; // gun pos when aim

export const WEAPON_SIGHT_TIP_LOCAL_POSITION = [0, 0.24, -1.05] as const;
export const WEAPON_MUZZLE_LOCAL_POSITION = [0, 0.02, -1.5] as const;

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

export function getWeaponViewPosition(aimProgress: number) {
    const progress = clamp01(aimProgress);

    return [
        WEAPON_HIP_POSITION[0] +
            (WEAPON_VIEW_POSITION[0] - WEAPON_HIP_POSITION[0]) * progress,
        WEAPON_HIP_POSITION[1] +
            (WEAPON_VIEW_POSITION[1] - WEAPON_HIP_POSITION[1]) * progress,
        WEAPON_HIP_POSITION[2] +
            (WEAPON_VIEW_POSITION[2] - WEAPON_HIP_POSITION[2]) * progress,
    ] as const;
}

export function toCameraLocalWeaponPoint(
    point: readonly [number, number, number],
    aimProgress = 1,
) {
    const viewPosition = getWeaponViewPosition(aimProgress);

    return [
        viewPosition[0] + point[0] * WEAPON_MODEL_SCALE,
        viewPosition[1] + point[1] * WEAPON_MODEL_SCALE,
        viewPosition[2] + point[2] * WEAPON_MODEL_SCALE,
    ] as const;
}

export const getWeaponMuzzlePosition = (aimProgress: number) =>
    toCameraLocalWeaponPoint(WEAPON_MUZZLE_LOCAL_POSITION, aimProgress);

export const WEAPON_SIGHT_TIP_POSITION = toCameraLocalWeaponPoint(
    WEAPON_SIGHT_TIP_LOCAL_POSITION,
);
export const WEAPON_MUZZLE_POSITION = toCameraLocalWeaponPoint(
    WEAPON_MUZZLE_LOCAL_POSITION,
);
