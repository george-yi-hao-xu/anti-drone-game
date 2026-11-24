import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { runtime } from "~/stores/RuntimeStore";
import type { Drone } from "~/types/Drone";
import { DRONE_TARGET } from "./droneMotion";

const BODY_COLORS = {
    direct: "#263f55",
    weave: "#e85d75",
    skimmer: "#f5a742",
} as const;

const ROTOR_POSITIONS: ReadonlyArray<readonly [number, number, number]> = [
    [-1.55, 0.05, 0],
    [1.55, 0.05, 0],
    [0, 0.05, -1.55],
    [0, 0.05, 1.55],
];

export const DroneModel = ({ drone }: { drone: Drone }) => {
    const group = useRef<THREE.Group>(null);
    const rotors = useRef<Array<THREE.Group | null>>([]);

    useFrame((_, delta) => {
        if (!group.current) {
            return;
        }

        group.current.visible = drone.active && !drone.destroyed && !drone.breached;
        if (!group.current.visible) {
            return;
        }

        group.current.position.copy(drone.position);
        group.current.lookAt(DRONE_TARGET.x, drone.position.y, DRONE_TARGET.z);
        group.current.rotation.z = Math.sin(runtime.elapsed * 3 + drone.phase) * 0.06;

        rotors.current.forEach((rotor, index) => {
            if (rotor) {
                rotor.rotation.y += delta * (index % 2 === 0 ? 26 : -26);
            }
        });
    });

    return (
        <group ref={group} visible={false} scale={1.15}>
            <mesh castShadow>
                <dodecahedronGeometry args={[0.72, 0]} />
                <meshStandardMaterial
                    color={BODY_COLORS[drone.profile]}
                    roughness={0.55}
                    metalness={0.18}
                />
            </mesh>

            <mesh castShadow position={[0, 0, -0.72]} rotation={[-Math.PI / 2, 0, 0]}>
                <coneGeometry args={[0.32, 0.7, 6]} />
                <meshStandardMaterial color="#172532" roughness={0.5} />
            </mesh>

            <mesh castShadow>
                <boxGeometry args={[3.25, 0.13, 0.16]} />
                <meshStandardMaterial color="#1c2d38" roughness={0.65} />
            </mesh>
            <mesh castShadow>
                <boxGeometry args={[0.16, 0.13, 3.25]} />
                <meshStandardMaterial color="#1c2d38" roughness={0.65} />
            </mesh>

            {ROTOR_POSITIONS.map((position, index) => (
                <group
                    key={index}
                    ref={(rotor) => {
                        rotors.current[index] = rotor;
                    }}
                    position={[...position]}
                >
                    <mesh>
                        <cylinderGeometry args={[0.18, 0.22, 0.18, 10]} />
                        <meshStandardMaterial color="#243d49" />
                    </mesh>
                    <mesh position={[0, 0.12, 0]}>
                        <boxGeometry args={[1.25, 0.025, 0.12]} />
                        <meshBasicMaterial color="#b9eaf4" transparent opacity={0.68} />
                    </mesh>
                </group>
            ))}

            <mesh position={[0, 0.08, -0.78]}>
                <sphereGeometry args={[0.13, 12, 8]} />
                <meshStandardMaterial
                    color="#ffed75"
                    emissive="#ffb52e"
                    emissiveIntensity={3}
                />
            </mesh>
        </group>
    );
};
