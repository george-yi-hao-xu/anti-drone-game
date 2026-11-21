import { Arena } from "../Arena/Arena";
import { DroneWave } from "../DroneWave/DroneWave";
import { GameLoop } from "../GameLoop/GameLoop";
import { PlayerControls } from "../PlayerControls/PlayerControls";

export const World = () => (
    <>
        <color attach="background" args={["#72b6df"]} />
        <fog attach="fog" args={["#72a7c6", 48, 185]} />

        <hemisphereLight args={["#dff6ff", "#31533f", 2.2]} />
        <directionalLight
            castShadow
            color="#fff4d1"
            intensity={2.8}
            position={[-45, 65, 30]}
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
            shadow-camera-far={180}
            shadow-camera-left={-90}
            shadow-camera-right={90}
            shadow-camera-top={90}
            shadow-camera-bottom={-90}
        />

        <Arena />
        <GameLoop />
        <PlayerControls />
        <DroneWave />
    </>
);
