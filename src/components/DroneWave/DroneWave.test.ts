import { describe, expect, it } from "vitest";
import { createDrones } from "../../stores/RuntimeStore";
import { DRONE_TARGET, getDronePosition } from "./droneMotion";

describe("drone flight profiles", () => {
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
