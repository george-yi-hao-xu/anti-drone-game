import { observer } from "mobx-react-lite";
import { PLAYER_POSITION } from "../../constants";
import { hud } from "../../stores/HudStore";
import { runtime } from "../../stores/RuntimeStore";
import { projectToRadar } from "./radarMath";
import "./GameRadar.scss";

const RADAR_RANGE = 140;

export const GameRadar = observer(() => {
    // Reading elapsed keeps this DOM display synchronized with the Three.js frame loop.
    const elapsed = hud.elapsed;
    const visibleDrones = runtime.drones.filter(
        (drone) => elapsed >= drone.spawnAt && !drone.destroyed && !drone.breached,
    );
    const north = projectToRadar(0, -1, 1, runtime.yaw);

    return (
        <section
            className="game-radar"
            aria-label={`Radar, ${visibleDrones.length} drone${visibleDrones.length === 1 ? "" : "s"} detected`}
        >
            {/* <span className="game-radar__label">Radar</span> */}
            <div className="game-radar__scope" aria-hidden="true">
                <span className="game-radar__ring" />
                <span className="game-radar__axis game-radar__axis--horizontal" />
                <span className="game-radar__axis game-radar__axis--vertical" />
                <span
                    className="game-radar__north"
                    style={{
                        left: `${north.left}%`,
                        top: `${north.top}%`,
                        transform: `translate(-50%, -50%) rotate(${runtime.yaw}rad) translateY(-12px)`,
                    }}
                >
                    N
                </span>
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
