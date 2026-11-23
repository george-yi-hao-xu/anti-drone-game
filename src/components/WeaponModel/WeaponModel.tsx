import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { MISSION } from "../../constants";
import { game } from "../../stores/GameStore";
import { hud } from "../../stores/HudStore";
import { runtime } from "../../stores/RuntimeStore";
import { getReloadHandTravel } from "./reloadAnimation";

const BASE_POSITION = new THREE.Vector3(0.45, -0.38, -0.85);

const MetalMaterial = ({ color = "#243541" }: { color?: string }) => (
    <meshStandardMaterial color={color} roughness={0.48} metalness={0.55} />
);

const GloveMaterial = () => (
    <meshStandardMaterial color="#273a34" roughness={0.92} />
);

export const WeaponModel = () => {
    const camera = useThree((state) => state.camera);
    const weapon = useRef<THREE.Group>(null);
    const leftArm = useRef<THREE.Group>(null);
    const localPosition = useMemo(() => new THREE.Vector3(), []);
    const localRotation = useMemo(() => new THREE.Quaternion(), []);

    useFrame(() => {
        if (!weapon.current) {
            return;
        }

        weapon.current.visible = game.phase === "playing" || game.phase === "paused";
        const bob = Math.sin(runtime.elapsed * 1.8) * 0.006;
        localPosition.set(
            BASE_POSITION.x + bob,
            BASE_POSITION.y + Math.abs(bob) * 0.5,
            BASE_POSITION.z + runtime.recoil * 2.3,
        );
        weapon.current.position
            .copy(localPosition)
            .applyQuaternion(camera.quaternion)
            .add(camera.position);
        localRotation.setFromEuler(
            new THREE.Euler(
                -0.025 + runtime.recoil * 0.7,
                -0.035,
                -0.025 + bob * 0.8,
                "YXZ",
            ),
        );
        weapon.current.quaternion.copy(camera.quaternion).multiply(localRotation);

        if (leftArm.current) {
            const reloadTravel = getReloadHandTravel(
                runtime.elapsed,
                runtime.reloadEnd,
                MISSION.reloadSeconds,
                hud.reloading,
            );
            leftArm.current.position.set(
                -0.04 * reloadTravel,
                -0.72 * reloadTravel,
                0.14 * reloadTravel,
            );
        }
    });

    return (
        <group ref={weapon}>
            <group scale={0.9}>
                <mesh castShadow position={[0, 0, 0]}>
                    <boxGeometry args={[0.28, 0.22, 0.72]} />
                    <MetalMaterial />
                </mesh>

                <mesh castShadow position={[0, 0.02, -0.64]} rotation={[Math.PI / 2, 0, 0]}>
                    <cylinderGeometry args={[0.038, 0.048, 0.7, 12]} />
                    <MetalMaterial color="#15232c" />
                </mesh>
                <mesh castShadow position={[0, 0.02, -1]} rotation={[Math.PI / 2, 0, 0]}>
                    <cylinderGeometry args={[0.072, 0.055, 0.16, 10]} />
                    <MetalMaterial color="#101c23" />
                </mesh>

                <mesh castShadow position={[0, -0.015, 0.48]}>
                    <boxGeometry args={[0.22, 0.18, 0.52]} />
                    <meshStandardMaterial color="#354a45" roughness={0.8} metalness={0.12} />
                </mesh>
                <mesh castShadow position={[0, -0.24, 0.2]} rotation={[-0.2, 0, 0]}>
                    <boxGeometry args={[0.13, 0.36, 0.17]} />
                    <meshStandardMaterial color="#1d2b2c" roughness={0.9} />
                </mesh>
                <mesh castShadow position={[0, -0.3, -0.08]} rotation={[0.13, 0, 0]}>
                    <boxGeometry args={[0.16, 0.42, 0.24]} />
                    <meshStandardMaterial color="#263b3d" roughness={0.82} metalness={0.15} />
                </mesh>

                <mesh castShadow position={[0, 0.18, -0.12]}>
                    <boxGeometry args={[0.09, 0.1, 0.34]} />
                    <MetalMaterial color="#172a32" />
                </mesh>
                <mesh position={[0, 0.245, -0.23]}>
                    <boxGeometry args={[0.035, 0.035, 0.055]} />
                    <meshStandardMaterial
                        color="#60e6ff"
                        emissive="#21b9d6"
                        emissiveIntensity={2.2}
                    />
                </mesh>

                <mesh castShadow position={[0.02, -0.39, 0.23]} scale={[1, 1.15, 1]}>
                    <sphereGeometry args={[0.14, 12, 8]} />
                    <GloveMaterial />
                </mesh>
                <mesh
                    castShadow
                    position={[0.2, -0.7, 0.48]}
                    rotation={[0.45, 0, 0.28]}
                >
                    <cylinderGeometry args={[0.13, 0.17, 0.72, 10]} />
                    <meshStandardMaterial color="#304a43" roughness={0.95} />
                </mesh>

                <group ref={leftArm}>
                    <mesh
                        castShadow
                        position={[-0.02, -0.17, -0.42]}
                        scale={[1.15, 0.9, 1]}
                    >
                        <sphereGeometry args={[0.14, 12, 8]} />
                        <GloveMaterial />
                    </mesh>
                    <mesh
                        castShadow
                        position={[-0.29, -0.58, -0.18]}
                        rotation={[0.72, 0, -0.5]}
                    >
                        <cylinderGeometry args={[0.13, 0.18, 0.82, 10]} />
                        <meshStandardMaterial color="#304a43" roughness={0.95} />
                    </mesh>
                </group>
            </group>
        </group>
    );
};
