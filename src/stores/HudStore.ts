import { makeAutoObservable } from "mobx";
import { MISSION } from "../constants";
import type { FireMode, HudState } from "../types";

const INITIAL_HUD: HudState = {
    health: 100,
    ammo: MISSION.magazineSize,
    reserve: MISSION.magazineSize * MISSION.spareMagazines,
    fireMode: "AUTO",
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
    health = INITIAL_HUD.health;
    ammo = INITIAL_HUD.ammo;
    reserve = INITIAL_HUD.reserve;
    fireMode: FireMode = INITIAL_HUD.fireMode;
    elapsed = INITIAL_HUD.elapsed;
    kills = INITIAL_HUD.kills;
    shots = INITIAL_HUD.shots;
    nearBlasts = INITIAL_HUD.nearBlasts;
    targetRange: number | null = INITIAL_HUD.targetRange;
    targetUnsafe = INITIAL_HUD.targetUnsafe;
    reloading = INITIAL_HUD.reloading;
    message = INITIAL_HUD.message;

    constructor() {
        makeAutoObservable(this);
    }

    reset() {
        Object.assign(this, INITIAL_HUD);
    }

    setElapsed(elapsed: number) {
        this.elapsed = Math.max(0, elapsed);
    }

    setAmmo(ammo: number, reserve = this.reserve) {
        this.ammo = Math.max(0, ammo);
        this.reserve = Math.max(0, reserve);
    }

    setFireMode(mode: FireMode) {
        this.fireMode = mode;
    }

    recordShot() {
        this.shots += 1;
    }

    recordKill() {
        this.kills += 1;
    }

    takeDamage(amount: number) {
        this.health = Math.max(0, this.health - Math.max(0, amount));
    }

    recordNearBlast() {
        this.nearBlasts += 1;
    }

    setTarget(range: number | null, unsafe = false) {
        this.targetRange = range;
        this.targetUnsafe = range !== null && unsafe;
    }

    setReloading(reloading: boolean) {
        this.reloading = reloading;
    }

    setMessage(message: string) {
        this.message = message;
    }
}

export { HudStore };
export const hud = new HudStore();
