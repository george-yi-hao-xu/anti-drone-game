import { useFrame } from "@react-three/fiber";
import { MISSION } from "../../constants";
import { game } from "../../stores/GameStore";
import { hud } from "../../stores/HudStore";
import { runtime } from "../../stores/RuntimeStore";
import { exitGamePointerLock } from "../PlayerControls/pointerLock";
import { getBreachedDrones, getMissionOutcome } from "./missionLogic";

function finishMission(won: boolean) {
    game.finish(won);
    runtime.setFireHeld(false);
    exitGamePointerLock();
}

export const MissionSystem = () => {
    useFrame(() => {
        if (game.phase !== "playing" || runtime.ended) {
            return;
        }

        const outcomeBeforeBreaches = getMissionOutcome(runtime.elapsed, hud.health);
        if (outcomeBeforeBreaches) {
            finishMission(outcomeBeforeBreaches === "victory");
            return;
        }

        const breachedDrones = getBreachedDrones(runtime.drones);
        breachedDrones.forEach((drone) => {
            drone.active = false;
            drone.breached = true;
            hud.takeDamage(MISSION.breachDamage);
            hud.recordNearBlast();
            hud.setMessage("PERIMETER BREACH");
            runtime.addBurst(drone.position, true);
            runtime.triggerCameraShake(0.85);
        });

        const outcomeAfterBreaches = getMissionOutcome(runtime.elapsed, hud.health);
        if (outcomeAfterBreaches) {
            finishMission(outcomeAfterBreaches === "victory");
        }
    });

    return null;
};
