import { useFrame, useThree } from "@react-three/fiber";
import { useEffect } from "react";
import * as THREE from "three";
import { MISSION, PLAYER_POSITION } from "../../constants";
import { game } from "../../stores/GameStore";
import { hud } from "../../stores/HudStore";
import { runtime } from "../../stores/RuntimeStore";
import { findHitDrone } from "./weaponLogic";

const MAX_TRACER_DISTANCE = 180;

function beginReload() {
    if (
        game.phase !== "playing" ||
        hud.reloading ||
        hud.ammo >= MISSION.magazineSize ||
        hud.reserve <= 0
    ) {
        return;
    }

    hud.setReloading(true);
    hud.setMessage("RELOADING");
    runtime.beginReload();
}

function completeReload() {
    hud.completeReload();
    hud.setMessage("DEFENSE ACTIVE");
}

function fire(camera: THREE.Camera) {
    if (
        game.phase !== "playing" ||
        hud.reloading ||
        runtime.elapsed - runtime.lastShot < MISSION.fireInterval
    ) {
        return;
    }

    if (!hud.consumeRound()) {
        beginReload();
        return;
    }

    const origin = camera.position.clone();
    const direction = camera.getWorldDirection(new THREE.Vector3()).normalize();
    const hit = findHitDrone(origin, direction, runtime.drones);
    const end = hit
        ? hit.drone.position.clone()
        : origin.clone().addScaledVector(direction, MAX_TRACER_DISTANCE);
    const tracerStart = origin.clone().addScaledVector(direction, 1.1);

    runtime.registerShot();
    runtime.addTracer(tracerStart, end);

    if (hit) {
        hit.drone.destroyed = true;
        hit.drone.active = false;
        hud.recordKill();
        hud.setMessage("TARGET DESTROYED");

        const horizontalRange = Math.hypot(
            hit.drone.position.x - PLAYER_POSITION[0],
            hit.drone.position.z - PLAYER_POSITION[2],
        );
        const unsafe = horizontalRange <= MISSION.safetyRadius;
        if (unsafe) {
            hud.recordNearBlast();
        }
        runtime.addBurst(hit.drone.position, unsafe);
    }

    if (hud.ammo === 0) {
        beginReload();
    }
}

export const WeaponSystem = () => {
    const camera = useThree((state) => state.camera);
    const canvas = useThree((state) => state.gl.domElement);

    useEffect(() => {
        const handleMouseDown = (event: MouseEvent) => {
            if (
                event.button !== 0 ||
                document.pointerLockElement !== canvas ||
                game.phase !== "playing"
            ) {
                return;
            }

            if (hud.fireMode === "AUTO") {
                runtime.setFireHeld(true);
            }
            fire(camera);
        };

        const stopFiring = () => runtime.setFireHeld(false);

        const handleKeyDown = (event: KeyboardEvent) => {
            if (game.phase !== "playing") {
                return;
            }

            if (event.code === "KeyR") {
                beginReload();
            }

            if (event.code === "KeyB" && !event.repeat) {
                hud.toggleFireMode();
                runtime.setFireHeld(false);
                hud.setMessage(`${hud.fireMode} FIRE`);
            }
        };

        document.addEventListener("mousedown", handleMouseDown);
        document.addEventListener("mouseup", stopFiring);
        document.addEventListener("pointerlockchange", stopFiring);
        document.addEventListener("keydown", handleKeyDown);
        window.addEventListener("blur", stopFiring);

        return () => {
            document.removeEventListener("mousedown", handleMouseDown);
            document.removeEventListener("mouseup", stopFiring);
            document.removeEventListener("pointerlockchange", stopFiring);
            document.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("blur", stopFiring);
        };
    }, [camera, canvas]);

    useFrame(() => {
        if (game.phase !== "playing") {
            return;
        }

        if (hud.reloading && runtime.elapsed >= runtime.reloadEnd) {
            completeReload();
        }

        if (runtime.fireHeld && hud.fireMode === "AUTO") {
            fire(camera);
        }
    });

    return null;
};
