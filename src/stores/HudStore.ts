import { makeAutoObservable } from "mobx";
import { MISSION } from '../constants'

const INITIAL_HUD = {
    health: 100,
    ammo: MISSION.magazineSize,
    reserve: MISSION.magazineSize * MISSION.spareMagazines,
    fireMode: "AUTO" as const,
    elapsed: 0,
    kills: 0,
    shots: 0,
    nearBlasts: 0,
    targetRange: null,
    targetUnsafe: false,
    reloading: false,
    message: "DEFENSE ACTIVE",
};

class HudStore {
    constructor() {
        Object.assign(this, INITIAL_HUD);
        makeAutoObservable(this);
    }

    reset() {
        Object.assign(this, INITIAL_HUD);
    }
}

export const hud = new HudStore();
