import * as THREE from "three";
import { describe, expect, it } from "vitest";
import { MISSION } from "~/constants";
import { createDrones } from "~/stores/RuntimeStore";
import { findHitDrone, getShotDirection, getShotSpreadRadians } from "./weaponLogic";

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

describe("weapon spread", () => {
    const forward = new THREE.Vector3(0, 0, -1);
    const identity = new THREE.Quaternion();

    it("uses separate hip-fire and aimed spread", () => {
        expect(THREE.MathUtils.radToDeg(getShotSpreadRadians(false))).toBeCloseTo(
            MISSION.hipSpreadDegrees,
        );
        expect(THREE.MathUtils.radToDeg(getShotSpreadRadians(true))).toBeCloseTo(
            MISSION.aimedSpreadDegrees,
        );
    });

    it("returns a normalized direction inside the active cone", () => {
        const randomValues = [1, 0];
        const direction = getShotDirection(identity, false, () => randomValues.shift() ?? 0);

        expect(direction.length()).toBeCloseTo(1);
        expect(THREE.MathUtils.radToDeg(forward.angleTo(direction))).toBeCloseTo(
            MISSION.hipSpreadDegrees,
        );
    });

    it("rotates spread with the camera orientation", () => {
        const yaw = new THREE.Quaternion().setFromAxisAngle(
            new THREE.Vector3(0, 1, 0),
            Math.PI / 2,
        );
        const direction = getShotDirection(yaw, true, () => 0);

        expect(direction.x).toBeCloseTo(-1);
        expect(direction.y).toBeCloseTo(0);
        expect(direction.z).toBeCloseTo(0);
    });
});
