import { describe, expect, it } from "vitest";
import { projectToRadar } from "./radarMath";

describe("projectToRadar", () => {
    it("keeps the player position in the center", () => {
        expect(projectToRadar(0, 0, 140)).toEqual({ left: 50, top: 50 });
    });

    it("projects world positions into the radar circle", () => {
        expect(projectToRadar(70, -70, 140)).toEqual({ left: 71.5, top: 28.5 });
    });

    it("clamps distant drones to the radar edge", () => {
        const point = projectToRadar(280, 0, 140);

        expect(point).toEqual({ left: 93, top: 50 });
    });

    it("rotates contacts around the player heading", () => {
        const aheadAfterTurningLeft = projectToRadar(-70, 0, 140, Math.PI / 2);
        const rightAfterTurningLeft = projectToRadar(0, -70, 140, Math.PI / 2);

        expect(aheadAfterTurningLeft.left).toBeCloseTo(50);
        expect(aheadAfterTurningLeft.top).toBeCloseTo(28.5);
        expect(rightAfterTurningLeft.left).toBeCloseTo(71.5);
        expect(rightAfterTurningLeft.top).toBeCloseTo(50);
    });
});
