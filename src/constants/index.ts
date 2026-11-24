export const MISSION = {
    duration: 60,
    phaseStart: [1, 20, 40],
    phaseSpan: [9, 5, 10],
    safetyRadius: 20,
    breachDamage: 25,
    magazineSize: 30,
    spareMagazines: 6,
    reloadSeconds: 2.2,
    bulletSpeed: 86,
    droneCount: 24,
    fireInterval: 0.1,
    hitRadius: 2,
    tracerSeconds: 0.07,
    burstSeconds: 0.38,
    recoilKick: 0.028,
    maxRecoil: 0.11,
    hipSpreadDegrees: 0.90,
    aimedSpreadDegrees: 0.25,
    maxBurstSpreadDegrees: 5,
};

export const PLAYER_POSITION = [0, 3.2, 0] as const;
export const INITIAL_VIEW_PITCH = -0.09;

export {
    getWeaponMuzzlePosition,
    getWeaponViewPosition,
    WEAPON_HIP_POSITION,
    WEAPON_MODEL_SCALE,
    WEAPON_MUZZLE_POSITION,
    WEAPON_SIGHT_TIP_POSITION,
    WEAPON_VIEW_POSITION,
} from "./weapon";
