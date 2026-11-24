import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { getWeaponViewPosition, MISSION, WEAPON_MODEL_SCALE } from "~/constants";
import { game } from "~/stores/GameStore";
import { hud } from "~/stores/HudStore";
import { runtime } from "~/stores/RuntimeStore";
import { getReloadHandTravel } from "./reloadAnimation";

const MetalMaterial = ({ color = "#243541" }: { color?: string }) => (
    <meshStandardMaterial color={color} roughness={0.42} metalness={0.68} />
);

const PolymerMaterial = ({ color = "#223330" }: { color?: string }) => (
    <meshStandardMaterial color={color} roughness={0.82} metalness={0.08} />
);

const GloveMaterial = () => (
    <meshStandardMaterial color="#2f4940" roughness={0.94} />
);

const IronSightMaterial = () => (
    <meshStandardMaterial color="#111b1e" roughness={0.38} metalness={0.72} />
);

export const WeaponModel = () => {
    const camera = useThree((state) => state.camera);
    const weapon = useRef<THREE.Group>(null);
    const leftArm = useRef<THREE.Group>(null);
    const localPosition = useMemo(() => new THREE.Vector3(), []);

    useFrame(() => {
        if (!weapon.current) {
            return;
        }

        weapon.current.visible = game.phase === "playing" || game.phase === "paused";
        const viewPosition = getWeaponViewPosition(runtime.aimProgress);

        // recoil to weapon
        localPosition.set(
            viewPosition[0] + runtime.recoil * 0.2, // hori
            viewPosition[1] + runtime.recoil * (-0.8),
            viewPosition[2] + runtime.recoil * 0.5,
        );
        weapon.current.position
            .copy(localPosition)
            .applyQuaternion(camera.quaternion)
            .add(camera.position);
        weapon.current.quaternion.copy(camera.quaternion);

        if (leftArm.current) {
            const handDropProgress = getReloadHandTravel(
                runtime.elapsed,
                runtime.reloadEnd,
                MISSION.reloadSeconds,
                hud.reloading,
            );
            leftArm.current.position.set(
                -0.04 * handDropProgress,
                -0.78 * handDropProgress,
                0.16 * handDropProgress,
            );
        }
    });

    return (
        <group ref={weapon}>
            <group scale={WEAPON_MODEL_SCALE}>
                {/* Receiver and compact buffer tube */}
                <mesh castShadow position={[0, -0.055, 0.42]} rotation={[Math.PI / 2, 0, 0]}>
                    <cylinderGeometry args={[0.055, 0.065, 0.4, 12]} />
                    <PolymerMaterial color="#263b38" />
                </mesh>
                <mesh castShadow position={[0, -0.08, 0.05]}>
                    <boxGeometry args={[0.32, 0.24, 0.72]} />
                    <MetalMaterial />
                </mesh>
                <mesh castShadow position={[0, 0.055, -0.08]}>
                    <boxGeometry args={[0.27, 0.07, 0.54]} />
                    <MetalMaterial color="#17262c" />
                </mesh>
                <mesh castShadow position={[-0.166, -0.06, 0.02]}>
                    <boxGeometry args={[0.018, 0.14, 0.42]} />
                    <MetalMaterial color="#42524d" />
                </mesh>

                {/* Handguard, barrel, and muzzle device */}
                <mesh castShadow position={[0, -0.035, -0.58]}>
                    <boxGeometry args={[0.27, 0.19, 0.58]} />
                    <PolymerMaterial color="#2b403b" />
                </mesh>
                {[-0.77, -0.61, -0.45].map((z) => (
                    <mesh key={z} castShadow position={[0, -0.137, z]}>
                        <boxGeometry args={[0.3, 0.025, 0.06]} />
                        <MetalMaterial color="#18282a" />
                    </mesh>
                ))}
                <mesh castShadow position={[0, 0.02, -1.08]} rotation={[Math.PI / 2, 0, 0]}>
                    <cylinderGeometry args={[0.034, 0.04, 0.72, 16]} />
                    <MetalMaterial color="#142126" />
                </mesh>
                <mesh castShadow position={[0, 0.02, -1.43]} rotation={[Math.PI / 2, 0, 0]}>
                    <cylinderGeometry args={[0.065, 0.05, 0.14, 12]} />
                    <MetalMaterial color="#0e181c" />
                </mesh>

                {/* Magazine and pistol grip */}
                <mesh castShadow position={[0, -0.34, -0.03]} rotation={[0.1, 0, 0]}>
                    <boxGeometry args={[0.18, 0.4, 0.24]} />
                    <PolymerMaterial color="#1d2d2c" />
                </mesh>
                <mesh castShadow position={[0, -0.31, 0.27]} rotation={[-0.22, 0, 0]}>
                    <boxGeometry args={[0.14, 0.35, 0.17]} />
                    <PolymerMaterial color="#172625" />
                </mesh>

                {/* Rear sight ears and front post align on the camera-center ray. */}
                <mesh castShadow position={[0, 0.13, 0.25]}>
                    <boxGeometry args={[0.18, 0.06, 0.08]} />
                    <IronSightMaterial />
                </mesh>
                {[-0.065, 0.065].map((x) => (
                    <mesh key={x} castShadow position={[x, 0.185, 0.25]}>
                        <boxGeometry args={[0.035, 0.11, 0.065]} />
                        <IronSightMaterial />
                    </mesh>
                ))}
                {/* 准星底座 */}
                {/* <mesh castShadow position={[0, 0.105, -1.05]}>
                    <boxGeometry args={[0.15, 0.05, 0.07]} />
                    <IronSightMaterial />
                </mesh> */}
                {/* 竖的准星 */}
                <mesh castShadow position={[0, 0.08, -1.05]}>
                    <boxGeometry args={[0.026, 0.32, 0.026]} />
                    <IronSightMaterial />
                </mesh>

                {/* Right firing hand and forearm */}
                <mesh castShadow position={[0.13, -0.36, 0.22]} scale={[0.9, 1.08, 0.86]}>
                    <sphereGeometry args={[0.12, 16, 10]} />
                    <GloveMaterial />
                </mesh>
                <mesh castShadow position={[0.24, -0.65, 0.43]} rotation={[0.48, 0, 0.28]}>
                    <capsuleGeometry args={[0.11, 0.5, 6, 12]} />
                    <meshStandardMaterial color="#344e45" roughness={0.95} />
                </mesh>

                {/* Left support hand and forearm; this group owns reload motion. */}
                <group ref={leftArm}>
                    {/* hand as a ball */}
                    {/* <mesh castShadow position={[-0.13, -0.19, -0.57]} scale={[1.04, 0.78, 0.94]}>
                        <sphereGeometry args={[0.115, 16, 10]} />
                        <GloveMaterial />
                    </mesh> */}
                    {/* fingers */}
                    {/* {[-0.19, -0.15, -0.11, -0.07].map((x) => (
                        <mesh key={x} castShadow position={[x, -0.11, -0.59]}>
                            <capsuleGeometry args={[0.018, 0.1, 4, 8]} />
                            <GloveMaterial />
                        </mesh>
                    ))} */}
                    {/* left arm */}
                    <mesh castShadow position={[-0.23, -0.52, -0.33]} rotation={[0.66, 0, -0.42]}>
                        <capsuleGeometry args={[0.11, 0.54, 6, 12]} />
                        <meshStandardMaterial color="#344e45" roughness={0.95} />
                    </mesh>
                </group>
            </group>
        </group>
    );
};
