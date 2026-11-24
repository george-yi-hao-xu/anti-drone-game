import { Canvas } from "@react-three/fiber";
import { INITIAL_VIEW_PITCH, PLAYER_POSITION } from "~/constants";
import { World } from "~/components/World/World";

export const GameCanvas = () => {
    return (
        <Canvas
            shadows
            dpr={[1, 1.6]}
            camera={{
                fov: 68,
                near: 0.1,
                far: 500,
                position: [...PLAYER_POSITION],
                rotation: [INITIAL_VIEW_PITCH, 0, 0],
            }}
            gl={{
                antialias: true,
                powerPreference: "high-performance",
            }}
        >
            <World />
        </Canvas>
    );
};

export default GameCanvas;
