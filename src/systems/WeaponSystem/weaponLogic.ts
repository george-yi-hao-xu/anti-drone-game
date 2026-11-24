import * as THREE from "three";
import { MISSION } from "~/constants";
import type { Drone } from "~/types/Drone";

export interface DroneHit {
    drone: Drone;
    distance: number;
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
