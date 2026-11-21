import { useFrame, useThree } from "@react-three/fiber";
import { useEffect } from "react";
import { game } from "../../stores/GameStore";
import { runtime } from "../../stores/RuntimeStore";
import { applyPointerMovement } from "./aimMath";

export const PlayerControls = () => {
    const camera = useThree((state) => state.camera);
    const canvas = useThree((state) => state.gl.domElement);

    useEffect(() => {
        camera.rotation.order = "YXZ";

        const handleMouseMove = (event: MouseEvent) => {
            if (document.pointerLockElement !== canvas || game.phase !== "playing") {
                return;
            }

            const aim = applyPointerMovement(
                runtime.yaw,
                runtime.pitch,
                event.movementX,
                event.movementY,
                game.sensitivity,
            );
            runtime.setAim(aim.yaw, aim.pitch);
        };

        const handlePointerLockChange = () => {
            if (document.pointerLockElement === canvas) {
                game.resume();
            } else {
                game.pause();
            }
        };

        const handleCanvasClick = () => {
            if (game.phase === "playing" && document.pointerLockElement !== canvas) {
                canvas.requestPointerLock();
            }
        };

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("pointerlockchange", handlePointerLockChange);
        canvas.addEventListener("click", handleCanvasClick);

        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("pointerlockchange", handlePointerLockChange);
            canvas.removeEventListener("click", handleCanvasClick);
        };
    }, [camera, canvas]);

    useFrame(() => {
        camera.rotation.set(runtime.pitch, runtime.yaw, 0, "YXZ");
    });

    return null;
};
