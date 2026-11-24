import * as THREE from "three";
import { MISSION } from "~/constants";
import type { Drone } from "~/types/Drone";

export interface DroneHit {
    drone: Drone;
    distance: number;
}

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

export function getShotSpreadRadians(isAiming: boolean) {
    const spreadDegrees = isAiming
        ? MISSION.aimedSpreadDegrees
        : MISSION.hipSpreadDegrees;
    return THREE.MathUtils.degToRad(spreadDegrees);
}

export function getShotDirection(
    cameraQuaternion: THREE.Quaternion,
    isAiming: boolean,
    random: () => number = Math.random,
) {
    const spread = getShotSpreadRadians(isAiming);
    const radius = Math.sqrt(clamp01(random())) * Math.tan(spread);
    const angle = clamp01(random()) * Math.PI * 2;

    return new THREE.Vector3(
        Math.cos(angle) * radius,
        Math.sin(angle) * radius,
        -1,
    )
        .normalize()
        .applyQuaternion(cameraQuaternion);
}

export function findHitDrone(
    origin: THREE.Vector3,
    direction: THREE.Vector3,
    drones: Drone[],
    hitRadius = MISSION.hitRadius,
): DroneHit | null {
    let closest: DroneHit | null = null;

    drones.forEach((drone) => {
        if (!drone.active || drone.destroyed) {
            return;
        }

        const toDrone = drone.position.clone().sub(origin);
        const distanceAlongRay = toDrone.dot(direction);
        if (distanceAlongRay <= 0) {
            return;
        }

        const closestPoint = origin.clone().addScaledVector(direction, distanceAlongRay);
        if (closestPoint.distanceToSquared(drone.position) > hitRadius * hitRadius) {
            return;
        }

        if (!closest || distanceAlongRay < closest.distance) {
            closest = { drone, distance: distanceAlongRay };
        }
    });

    return closest;
}
