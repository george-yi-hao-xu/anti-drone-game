import { useFrame } from "@react-three/fiber";
import { game } from "~/stores/GameStore";
import { hud } from "~/stores/HudStore";
import { runtime } from "~/stores/RuntimeStore";

const MAX_FRAME_DELTA = 0.05;

export const GameLoop = () => {
    useFrame((_, delta) => {
        if (game.phase !== "playing" || runtime.ended) {
            return;
        }

        const frameDelta = Math.min(delta, MAX_FRAME_DELTA);
        runtime.advance(frameDelta);
        runtime.updateAim(frameDelta);
        hud.setElapsed(runtime.elapsed);
    });

    return null;
};
