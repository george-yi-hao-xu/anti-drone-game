import { describe, expect, it } from "vitest";
import * as THREE from "three";
import { createDrones } from "~/stores/RuntimeStore";
import { DRONE_TARGET, getDronePosition } from "./droneMotion";

describe("drone flight profiles", () => {
    it("spawns every wave inside a forward-facing arc", () => {
        const phaseLimits = [30, 45, 60];

        createDrones().forEach((drone, id) => {
            const phase = id < 6 ? 0 : id < 14 ? 1 : 2;
            const angle = Math.abs(
                THREE.MathUtils.radToDeg(Math.atan2(drone.start.x, -drone.start.z)),
            );

            expect(angle).toBeLessThanOrEqual(phaseLimits[phase] + 0.001);
        });
    });

    it("keeps consecutive drone directions close together", () => {
        const drones = createDrones();
        const angles = drones.map((drone) =>
            Math.round(THREE.MathUtils.radToDeg(Math.atan2(drone.start.x, -drone.start.z))),
        );
        const directionChanges = angles.slice(1).map((angle, index) =>
            Math.abs(angle - angles[index]),
        );

        expect(angles.slice(0, 6)).toEqual([-30, -18, -6, 6, 18, 30]);
        expect(Math.max(...directionChanges)).toBeLessThanOrEqual(15);
    });

    it("starts drones far enough away to emerge through the fog", () => {
        const radii = createDrones().map((drone) =>
            Math.hypot(drone.start.x, drone.start.z),
        );

        expect(Math.min(...radii)).toBeGreaterThanOrEqual(170);
        expect(Math.max(...radii)).toBeLessThan(205);
    });

    it("keeps a drone at its start before its spawn time", () => {
        const drone = createDrones()[0];
        const state = getDronePosition(drone, drone.spawnAt - 2);

        expect(state.progress).toBe(0);
        expect(state.position.equals(drone.start)).toBe(true);
    });

    it("moves a direct drone toward the center", () => {
        const drone = createDrones().find((item) => item.profile === "direct")!;
        const state = getDronePosition(drone, drone.spawnAt + 3);

        expect(state.progress).toBeGreaterThan(0);
        expect(Math.hypot(state.position.x, state.position.z)).toBeLessThan(
            Math.hypot(drone.start.x, drone.start.z),
        );
    });

    it("offsets weave drones from their straight approach line", () => {
        const drone = createDrones().find((item) => item.profile === "weave")!;
        const state = getDronePosition(drone, drone.spawnAt + 3);
        const straight = drone.start.clone().lerp(DRONE_TARGET, state.progress);

        expect(state.position.distanceTo(straight)).toBeGreaterThan(0.1);
    });

    it("keeps skimmers close to the ground", () => {
        const drone = createDrones().find((item) => item.profile === "skimmer")!;
        const state = getDronePosition(drone, drone.spawnAt + 2);

        expect(state.position.y).toBeLessThan(7.5);
    });
});
