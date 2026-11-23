import { describe, expect, it } from "vitest";
import {
    getWeaponMuzzlePosition,
    getWeaponViewPosition,
    WEAPON_MUZZLE_POSITION,
    WEAPON_SIGHT_TIP_POSITION,
    toCameraLocalWeaponPoint,
} from "./weapon";

describe("weapon view layout", () => {
    it("centers the sight tip on the camera aim axis", () => {
        expect(WEAPON_SIGHT_TIP_POSITION[0]).toBeCloseTo(0);
        expect(WEAPON_SIGHT_TIP_POSITION[1]).toBeCloseTo(0);
        expect(WEAPON_SIGHT_TIP_POSITION[2]).toBeLessThan(0);
    });

    it("places the muzzle below the sight and in front of the weapon", () => {
        expect(WEAPON_MUZZLE_POSITION[0]).toBeCloseTo(0);
        expect(WEAPON_MUZZLE_POSITION[1]).toBeLessThan(WEAPON_SIGHT_TIP_POSITION[1]);
        expect(WEAPON_MUZZLE_POSITION[2]).toBeLessThan(WEAPON_SIGHT_TIP_POSITION[2]);
    });

    it("transforms local weapon points into camera-local coordinates", () => {
        const center = toCameraLocalWeaponPoint([0, 0, 0]);

        expect(center).toEqual([0, -0.12, -1.03]);
    });

    it("moves from hip fire to the centered sight position", () => {
        expect(getWeaponViewPosition(0)).toEqual([0.36, -0.32, -0.9]);
        expect(getWeaponViewPosition(1)).toEqual([0, -0.12, -1.03]);
        const midpoint = getWeaponViewPosition(0.5);
        expect(midpoint[0]).toBeCloseTo(0.18);
        expect(midpoint[1]).toBeCloseTo(-0.22);
        expect(midpoint[2]).toBeCloseTo(-0.965);

        expect(getWeaponMuzzlePosition(0)[0]).toBeGreaterThan(
            getWeaponMuzzlePosition(1)[0],
        );
    });
});
