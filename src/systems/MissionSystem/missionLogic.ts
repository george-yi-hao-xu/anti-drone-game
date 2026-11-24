import { MISSION, PLAYER_POSITION } from "~/constants";
import type { Drone } from "~/types/Drone";

export type MissionOutcome = "victory" | "defeat" | null;

export function getMissionOutcome(elapsed: number, health: number): MissionOutcome {
    if (elapsed >= MISSION.duration) {
        return "victory";
    }

    if (health <= 0) {
        return "defeat";
    }

    return null;
}

export function getBreachedDrones(drones: Drone[]) {
    return drones.filter((drone) => {
        if (!drone.active || drone.destroyed || drone.breached) {
            return false;
        }

        const horizontalDistance = Math.hypot(
            drone.position.x - PLAYER_POSITION[0],
            drone.position.z - PLAYER_POSITION[2],
        );
        return horizontalDistance <= MISSION.safetyRadius;
    });
}
