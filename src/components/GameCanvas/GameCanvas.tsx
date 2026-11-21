import { Canvas } from "@react-three/fiber";
import { World } from "../World/World";

export const GameCanvas = () => {
    return (
        <Canvas
            shadows
            dpr={[1, 1.6]}
            camera={{
                fov: 68,
                near: 0.1,
                far: 500,
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
