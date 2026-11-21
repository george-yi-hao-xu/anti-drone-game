import * as THREE from "three";
import { PLAYER_POSITION } from "../../constants";
import type { Drone } from "../../types/Drone";

export const DRONE_TARGET = new THREE.Vector3(...PLAYER_POSITION);

export function getDronePosition(drone: Drone, elapsed: number) {
    const age = Math.max(0, elapsed - drone.spawnAt);
    const horizontalDistance = Math.hypot(drone.start.x, drone.start.z);
    const progress = Math.min(1, (age * drone.speed) / horizontalDistance);
    const position = drone.start.clone().lerp(DRONE_TARGET, progress);

    if (drone.profile === "weave") {
        const perpendicular = new THREE.Vector3(-drone.start.z, 0, drone.start.x)
            .normalize()
            .multiplyScalar(Math.sin(age * 2.25 + drone.phase) * 4 * (1 - progress * 0.45));
        position.add(perpendicular);
        position.y += Math.sin(age * 1.7 + drone.phase) * 0.8;
    }

    if (drone.profile === "skimmer") {
        position.y = THREE.MathUtils.lerp(drone.start.y, DRONE_TARGET.y, progress);
        position.y += Math.sin(age * 2.8 + drone.phase) * 0.35;
    }

    return { position, progress };
}
