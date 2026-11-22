import * as THREE from "three";
import { describe, expect, it } from "vitest";
import { createDrones } from "../../stores/RuntimeStore";
import { findHitDrone } from "./weaponLogic";

function activeDroneAt(id: number, position: THREE.Vector3) {
    const drone = createDrones()[id];
    drone.active = true;
    drone.position.copy(position);
    return drone;
}

describe("hitscan targeting", () => {
    const origin = new THREE.Vector3(0, 3.2, 0);
    const forward = new THREE.Vector3(0, 0, -1);

    it("selects the nearest drone under the crosshair", () => {
        const near = activeDroneAt(0, new THREE.Vector3(0.5, 3.2, -20));
        const far = activeDroneAt(1, new THREE.Vector3(0, 3.2, -40));

        const hit = findHitDrone(origin, forward, [far, near]);

        expect(hit?.drone.id).toBe(near.id);
        expect(hit?.distance).toBeCloseTo(20);
    });

    it("ignores drones outside the hit radius", () => {
        const drone = activeDroneAt(0, new THREE.Vector3(4, 3.2, -20));

        expect(findHitDrone(origin, forward, [drone])).toBeNull();
    });

    it("ignores destroyed, inactive, and behind-camera drones", () => {
        const destroyed = activeDroneAt(0, new THREE.Vector3(0, 3.2, -20));
        destroyed.destroyed = true;
        const inactive = activeDroneAt(1, new THREE.Vector3(0, 3.2, -15));
        inactive.active = false;
        const behind = activeDroneAt(2, new THREE.Vector3(0, 3.2, 10));

        expect(findHitDrone(origin, forward, [destroyed, inactive, behind])).toBeNull();
    });
});
