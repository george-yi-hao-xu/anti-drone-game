import { MISSION } from "../../constants";

const GUIDE_RINGS = [MISSION.safetyRadius, 50, 90];

const BEACONS = [
    { position: [0, 0, -72] as const, color: "#27d7ff", scale: 1.25 },
    { position: [72, 0, 0] as const, color: "#ffcb45", scale: 1 },
    { position: [0, 0, 72] as const, color: "#ff6b8a", scale: 1 },
    { position: [-72, 0, 0] as const, color: "#8bf08f", scale: 1 },
];

const PERIMETER_MARKERS = Array.from({ length: 16 }, (_, index) => {
    const angle = (index / 16) * Math.PI * 2;

    return {
        x: Math.sin(angle) * 105,
        z: Math.cos(angle) * 105,
    };
});

const GuideRing = ({ radius, color }: { radius: number; color: string }) => (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.035, 0]}>
        <ringGeometry args={[radius - 0.12, radius + 0.12, 128]} />
        <meshBasicMaterial color={color} transparent opacity={0.72} />
    </mesh>
);

const Beacon = ({
    position,
    color,
    scale,
}: {
    position: readonly [number, number, number];
    color: string;
    scale: number;
}) => (
    <group position={[...position]} scale={scale}>
        <mesh castShadow position={[0, 2.1, 0]}>
            <cylinderGeometry args={[0.18, 0.3, 4.2, 8]} />
            <meshStandardMaterial color="#213c4b" roughness={0.6} />
        </mesh>
        <mesh position={[0, 4.35, 0]}>
            <octahedronGeometry args={[0.65, 0]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2.5} />
        </mesh>
        <pointLight color={color} intensity={5} distance={12} position={[0, 4.2, 0]} />
    </group>
);

export const Arena = () => (
    <group>
        <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[420, 420]} />
            <meshStandardMaterial color="#416d52" roughness={0.94} />
        </mesh>

        <gridHelper
            args={[240, 24, "#5e91a2", "#315b64"]}
            position={[0, 0.025, 0]}
        />

        {GUIDE_RINGS.map((radius, index) => (
            <GuideRing
                key={radius}
                radius={radius}
                color={index === 0 ? "#ffcf5a" : "#8bc8d6"}
            />
        ))}

        <mesh receiveShadow position={[0, 0.12, 0]}>
            <cylinderGeometry args={[5.5, 6.2, 0.24, 48]} />
            <meshStandardMaterial color="#183c4b" roughness={0.75} metalness={0.1} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.25, 0]}>
            <ringGeometry args={[4.4, 5.05, 48]} />
            <meshBasicMaterial color="#52d6f4" transparent opacity={0.8} />
        </mesh>

        {BEACONS.map((beacon) => (
            <Beacon key={beacon.color} {...beacon} />
        ))}

        {PERIMETER_MARKERS.map(({ x, z }, index) => (
            <mesh key={index} castShadow position={[x, 1.15, z]}>
                <boxGeometry args={[0.55, 2.3, 0.55]} />
                <meshStandardMaterial
                    color={index % 2 === 0 ? "#d9f1f4" : "#294e5a"}
                    roughness={0.7}
                />
            </mesh>
        ))}
    </group>
);
