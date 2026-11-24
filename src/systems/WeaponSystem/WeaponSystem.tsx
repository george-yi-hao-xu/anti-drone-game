import { useFrame, useThree } from "@react-three/fiber";
import { useEffect } from "react";
import * as THREE from "three";
import { getWeaponMuzzlePosition, MISSION, PLAYER_POSITION } from "~/constants";
import { game } from "~/stores/GameStore";
import { hud } from "~/stores/HudStore";
import { runtime } from "~/stores/RuntimeStore";
import { findHitDrone } from "./weaponLogic";
import { playGunfireSound } from "./gunfireAudio";
import { playReloadSound } from "./reloadAudio";

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
    playReloadSound();
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
    const tracerStart = new THREE.Vector3(...getWeaponMuzzlePosition(runtime.aimProgress))
        .applyQuaternion(camera.quaternion)
        .add(camera.position);

    runtime.registerShot();
    playGunfireSound();
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
                document.pointerLockElement !== canvas ||
                game.phase !== "playing"
            ) {
                return;
            }

            if (event.button === 2) {
                if (!hud.reloading) {
                    runtime.setAiming(true);
                }
                return;
            }

            if (event.button !== 0) {
                return;
            }

            if (hud.fireMode === "AUTO") {
                runtime.setFireHeld(true);
            }
            fire(camera);
        };

        const handleMouseUp = (event: MouseEvent) => {
            if (event.button === 0) {
                runtime.setFireHeld(false);
            }
            if (event.button === 2) {
                runtime.setAiming(false);
            }
        };

        const stopInteractions = () => {
            runtime.setFireHeld(false);
            runtime.setAiming(false);
        };

        const preventContextMenu = (event: MouseEvent) => event.preventDefault();

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
        document.addEventListener("mouseup", handleMouseUp);
        document.addEventListener("pointerlockchange", stopInteractions);
        document.addEventListener("keydown", handleKeyDown);
        canvas.addEventListener("contextmenu", preventContextMenu);
        window.addEventListener("blur", stopInteractions);

        return () => {
            document.removeEventListener("mousedown", handleMouseDown);
            document.removeEventListener("mouseup", handleMouseUp);
            document.removeEventListener("pointerlockchange", stopInteractions);
            document.removeEventListener("keydown", handleKeyDown);
            canvas.removeEventListener("contextmenu", preventContextMenu);
            window.removeEventListener("blur", stopInteractions);
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
