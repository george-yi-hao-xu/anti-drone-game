import { useFrame } from "@react-three/fiber";
import { observer } from "mobx-react-lite";
import { game } from "../../stores/GameStore";
import { runtime } from "../../stores/RuntimeStore";
import { DroneModel } from "./DroneModel";
import { getDronePosition } from "./droneMotion";

export const DroneWave = observer(() => {
    const revision = runtime.revision;

    useFrame(() => {
        if (game.phase !== "playing" || runtime.ended) {
            return;
        }

        runtime.drones.forEach((drone) => {
            if (drone.destroyed || drone.breached || runtime.elapsed < drone.spawnAt) {
                drone.active = false;
                return;
            }

            const next = getDronePosition(drone, runtime.elapsed);
            drone.progress = next.progress;
            drone.position.copy(next.position);
            drone.active = next.progress < 1;
        });
    });

    return (
        <group key={revision}>
            {runtime.drones.map((drone) => (
                <DroneModel key={drone.id} drone={drone} />
            ))}
        </group>
    );
});
