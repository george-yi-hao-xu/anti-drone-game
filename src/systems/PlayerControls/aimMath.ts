import * as THREE from "three";

const AIM_SPEED = 0.0018;
const MIN_PITCH = -1.2;
const MAX_PITCH = 1.05;

export function applyPointerMovement(
    yaw: number,
    pitch: number,
    movementX: number,
    movementY: number,
    sensitivity: number,
) {
    const nextYaw = THREE.MathUtils.euclideanModulo(
        yaw - movementX * AIM_SPEED * sensitivity + Math.PI,
        Math.PI * 2,
    ) - Math.PI;
    const nextPitch = THREE.MathUtils.clamp(
        pitch - movementY * AIM_SPEED * sensitivity,
        MIN_PITCH,
        MAX_PITCH,
    );

    return { yaw: nextYaw, pitch: nextPitch };
}
