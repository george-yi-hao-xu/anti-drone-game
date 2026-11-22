import { useEffect, useMemo } from "react";
import * as THREE from "three";
import { MISSION } from "../../constants";
import {
    BEARING_PANELS,
    CARDINAL_PANELS,
    type PositionPanelConfig,
} from "./arenaLayout";

const GUIDE_RINGS = [MISSION.safetyRadius, 50, 90];

const GuideRing = ({ radius, color }: { radius: number; color: string }) => (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.035, 0]}>
        <ringGeometry args={[radius - 0.12, radius + 0.12, 128]} />
        <meshBasicMaterial color={color} transparent opacity={0.72} />
    </mesh>
);

const PositionPanel = ({ position, rotationY, label, variant, accent }: PositionPanelConfig) => {
    const texture = useMemo(() => {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        canvas.width = 256;
        canvas.height = 128;

        if (context) {
            context.fillStyle = "#343c2c";
            context.fillRect(0, 0, canvas.width, canvas.height);

            context.strokeStyle = "#c7c9a5";
            context.lineWidth = 7;
            context.strokeRect(8, 8, canvas.width - 16, canvas.height - 16);

            context.fillStyle = accent ?? "#8e9879";
            context.fillRect(15, canvas.height - 24, canvas.width - 30, 10);

            context.fillStyle = "#ecebd1";
            context.font = `900 ${variant === "cardinal" ? 82 : 76}px monospace`;
            context.textAlign = "center";
            context.textBaseline = "middle";
            context.fillText(label, canvas.width / 2, canvas.height / 2 - 4);
        }

        const panelTexture = new THREE.CanvasTexture(canvas);
        panelTexture.colorSpace = THREE.SRGBColorSpace;
        panelTexture.minFilter = THREE.LinearFilter;
        return panelTexture;
    }, [accent, label, variant]);

    useEffect(() => () => texture.dispose(), [texture]);

    const isCardinal = variant === "cardinal";
    const width = isCardinal ? 4.8 : 4;
    const height = isCardinal ? 2.6 : 2;
    const centerY = height / 2 + 0.05;

    return (
        <group position={[...position]} rotation={[0, rotationY, 0]}>
            <mesh castShadow receiveShadow position={[0, centerY, 0]}>
                <boxGeometry args={[width, height, 0.2]} />
                <meshStandardMaterial color="#293124" roughness={0.88} metalness={0.04} />
            </mesh>

            <mesh position={[0, centerY, 0.105]}>
                <planeGeometry args={[width * 0.94, height * 0.88]} />
                <meshBasicMaterial map={texture} toneMapped={false} fog={false} />
            </mesh>
        </group>
    );
};

export const Arena = () => (
    <group>
        {/* ground */}
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

        {/* centred circle w/ a ring */}
        <mesh receiveShadow position={[0, 0.12, 0]}>
            <cylinderGeometry args={[5.5, 6.2, 0.24, 48]} />
            <meshStandardMaterial color="#183c4b" roughness={0.75} metalness={0.1} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.25, 0]}>
            <ringGeometry args={[4.4, 5.05, 48]} />
            <meshBasicMaterial color="#52d6f4" transparent opacity={0.8} />
        </mesh>

        {CARDINAL_PANELS.map((panel) => (
            <PositionPanel key={`cardinal-${panel.label}`} {...panel} />
        ))}

        {BEARING_PANELS.map((panel) => (
            <PositionPanel key={`bearing-${panel.label}`} {...panel} />
        ))}
    </group>
);
