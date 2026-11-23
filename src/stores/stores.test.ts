import { describe, expect, it } from "vitest";
import { MISSION } from "../constants";
import { GameStore } from "./GameStore";
import { HudStore } from "./HudStore";
import { RuntimeStore } from "./RuntimeStore";

function createStores() {
    const hud = new HudStore();
    const runtime = new RuntimeStore();
    const game = new GameStore(hud, runtime);

    return { game, hud, runtime };
}

describe("game lifecycle", () => {
    it("starts a mission with clean HUD and runtime state", () => {
        const { game, hud, runtime } = createStores();
        hud.takeDamage(50);
        hud.recordKill();
        runtime.elapsed = 32;
        runtime.drones[0].destroyed = true;

        game.start();

        expect(game.phase).toBe("playing");
        expect(game.result).toBeNull();
        expect(hud.health).toBe(100);
        expect(hud.kills).toBe(0);
        expect(runtime.elapsed).toBe(0);
        expect(runtime.drones).toHaveLength(MISSION.droneCount);
        expect(runtime.drones.every((drone) => !drone.destroyed)).toBe(true);
    });

    it("only pauses and resumes from valid phases", () => {
        const { game } = createStores();

        game.pause();
        expect(game.phase).toBe("briefing");

        game.start();
        game.pause();
        expect(game.phase).toBe("paused");

        game.resume();
        expect(game.phase).toBe("playing");
    });

    it("captures a result before entering a terminal phase", () => {
        const { game, hud, runtime } = createStores();
        game.start();
        hud.recordKill();
        hud.recordShot();
        hud.takeDamage(25);

        game.finish(true);

        expect(game.phase).toBe("victory");
        expect(runtime.ended).toBe(true);
        expect(game.result).toEqual({
            won: true,
            kills: 1,
            shots: 1,
            health: 75,
            nearBlasts: 0,
        });
    });

    it("returns every store to the briefing baseline", () => {
        const { game, hud, runtime } = createStores();
        game.start();
        hud.takeDamage(100);
        runtime.elapsed = 90;
        game.finish(false);

        game.returnToBriefing();

        expect(game.phase).toBe("briefing");
        expect(game.result).toBeNull();
        expect(hud.health).toBe(100);
        expect(runtime.elapsed).toBe(0);
        expect(runtime.ended).toBe(false);
    });
});

describe("HUD state", () => {
    it("clamps damage, elapsed time, ammunition, and sensitivity", () => {
        const { game, hud } = createStores();

        hud.takeDamage(125);
        hud.setElapsed(-10);
        hud.setAmmo(-2, -4);
        game.setSensitivity(8);

        expect(hud.health).toBe(0);
        expect(hud.elapsed).toBe(0);
        expect(hud.ammo).toBe(0);
        expect(hud.reserve).toBe(0);
        expect(game.sensitivity).toBe(2);
    });

    it("consumes ammunition and reloads from the reserve", () => {
        const { hud } = createStores();

        expect(hud.consumeRound()).toBe(true);
        expect(hud.ammo).toBe(MISSION.magazineSize - 1);
        expect(hud.shots).toBe(1);

        hud.setReloading(true);
        hud.completeReload();

        expect(hud.ammo).toBe(MISSION.magazineSize);
        expect(hud.reserve).toBe(MISSION.magazineSize * MISSION.spareMagazines - 1);
        expect(hud.reloading).toBe(false);
    });

    it("switches between automatic and semi-automatic fire", () => {
        const { hud } = createStores();

        hud.toggleFireMode();
        expect(hud.fireMode).toBe("SEMI");

        hud.toggleFireMode();
        expect(hud.fireMode).toBe("AUTO");
    });

    it("smoothly enters and leaves aim mode", () => {
        const { runtime } = createStores();

        runtime.setAiming(true);
        runtime.updateAim(0.05);
        expect(runtime.aimProgress).toBeGreaterThan(0);
        expect(runtime.aimProgress).toBeLessThan(1);

        runtime.updateAim(1);
        expect(runtime.aimProgress).toBeCloseTo(1, 3);

        runtime.setAiming(false);
        runtime.updateAim(1);
        expect(runtime.aimProgress).toBeCloseTo(0, 3);
    });
});
