import { observer } from "mobx-react-lite";
import { PLAYER_POSITION } from "../../constants";
import { hud } from "../../stores/HudStore";
import { runtime } from "../../stores/RuntimeStore";
import { projectToRadar } from "./radarMath";
import "./GameRadar.scss";

const RADAR_RANGE = 140;
const CARDINAL_DIRECTIONS = [
    { label: "N", x: 0, z: -1 },
    { label: "E", x: 1, z: 0 },
    { label: "S", x: 0, z: 1 },
    { label: "W", x: -1, z: 0 },
] as const;
const CARDINAL_OFFSET_PX = 12;

export const GameRadar = observer(() => {
    // Reading elapsed keeps this DOM display synchronized with the Three.js frame loop.
    const elapsed = hud.elapsed;
    const visibleDrones = runtime.drones.filter(
        (drone) => elapsed >= drone.spawnAt && !drone.destroyed && !drone.breached,
    );

    return (
        <section
            className="game-radar"
            aria-label={`Radar, ${visibleDrones.length} drone${visibleDrones.length === 1 ? "" : "s"} detected`}
        >
            {/* <span className="game-radar__label">Radar</span> */}
            <div className="game-radar__scope" aria-hidden="true">
                <span className="game-radar__ring" />
                <div
                    className="game-radar__axes"
                    style={{ transform: `rotate(${runtime.yaw}rad)` }}
                >
                    <span className="game-radar__axis game-radar__axis--horizontal" />
                    <span className="game-radar__axis game-radar__axis--vertical" />
                </div>
                {CARDINAL_DIRECTIONS.map(({ label, x, z }) => {
                    const point = projectToRadar(x, z, 1, runtime.yaw);
                    const directionX = point.left - 50;
                    const directionY = point.top - 50;
                    const directionLength = Math.hypot(directionX, directionY);

                    return (
                        <span
                            key={label}
                            className="game-radar__cardinal"
                            style={{
                                left: `calc(${point.left}% + ${(directionX / directionLength) * CARDINAL_OFFSET_PX}px)`,
                                top: `calc(${point.top}% + ${(directionY / directionLength) * CARDINAL_OFFSET_PX}px)`,
                                transform: `translate(-50%, -50%) rotate(${runtime.yaw}rad)`,
                            }}
                        >
                            {label}
                        </span>
                    );
                })}
                <span className="game-radar__player" />

                {visibleDrones.map((drone) => {
                    const point = projectToRadar(
                        drone.position.x - PLAYER_POSITION[0],
                        drone.position.z - PLAYER_POSITION[2],
                        RADAR_RANGE,
                        runtime.yaw,
                    );

                    return (
                        <span
                            key={drone.id}
                            className="game-radar__drone"
                            style={{ left: `${point.left}%`, top: `${point.top}%` }}
                        />
                    );
                })}
            </div>
        </section>
    );
});
