import { useFrame, useThree } from "@react-three/fiber";
import { observer } from "mobx-react-lite";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { MISSION, WEAPON_MUZZLE_POSITION } from "../../constants";
import { game } from "../../stores/GameStore";
import { runtime } from "../../stores/RuntimeStore";
import type { Burst } from "../../types/Burst";
import type { Tracer } from "../../types/Tracer";

const TracerEffect = ({ tracer }: { tracer: Tracer }) => {
    const transform = useMemo(() => {
        const direction = tracer.end.clone().sub(tracer.start);
        const length = direction.length();
        const midpoint = tracer.start.clone().add(tracer.end).multiplyScalar(0.5);
        const quaternion = new THREE.Quaternion().setFromUnitVectors(
            new THREE.Vector3(0, 1, 0),
            direction.normalize(),
        );

        return { length, midpoint, quaternion };
    }, [tracer]);

    return (
        <mesh position={transform.midpoint} quaternion={transform.quaternion}>
            <cylinderGeometry args={[0.025, 0.055, transform.length, 6]} />
            <meshBasicMaterial color="#fff2a8" transparent opacity={0.9} />
        </mesh>
    );
};

const BurstEffect = ({ burst }: { burst: Burst }) => {
    const mesh = useRef<THREE.Mesh>(null);
    const material = useRef<THREE.MeshBasicMaterial>(null);

    useFrame(() => {
        const progress = 1 - Math.max(0, burst.life) / MISSION.burstSeconds;
        mesh.current?.scale.setScalar(0.35 + progress * 2.5);
        if (material.current) {
            material.current.opacity = Math.max(0, 0.9 - progress);
        }
    });

    return (
        <mesh ref={mesh} position={burst.position}>
            <icosahedronGeometry args={[0.8, 1]} />
            <meshBasicMaterial
                ref={material}
                color={burst.unsafe ? "#ff4d6d" : "#ffbd4a"}
                transparent
                opacity={0.9}
                depthWrite={false}
            />
        </mesh>
    );
};

const MuzzleFlash = () => {
    const group = useRef<THREE.Group>(null);
    const camera = useThree((state) => state.camera);
    const localMuzzle = useMemo(() => new THREE.Vector3(...WEAPON_MUZZLE_POSITION), []);

    useFrame(() => {
        if (!group.current) {
            return;
        }

        group.current.visible = runtime.muzzleFlash > 0;
        if (!group.current.visible) {
            return;
        }

        group.current.position
            .copy(localMuzzle)
            .applyQuaternion(camera.quaternion)
            .add(camera.position);
        group.current.quaternion.copy(camera.quaternion);
        group.current.scale.setScalar(0.75 + Math.random() * 0.4);
    });

    return (
        <group ref={group} visible={false}>
            <mesh>
                <octahedronGeometry args={[0.1, 0]} />
                <meshBasicMaterial color="#fff6b7" />
            </mesh>
            <pointLight color="#ffbd4a" intensity={2.5} distance={7} />
        </group>
    );
};

export const WeaponEffects = observer(() => {
    const effectRevision = runtime.effectRevision;

    useFrame((_, delta) => {
        if (game.phase === "playing") {
            runtime.updateEffects(Math.min(delta, 0.05));
        }
    });

    return (
        <group key={effectRevision}>
            <MuzzleFlash />
            {runtime.tracers.map((tracer) => (
                <TracerEffect key={tracer.id} tracer={tracer} />
            ))}
            {runtime.bursts.map((burst) => (
                <BurstEffect key={burst.id} burst={burst} />
            ))}
        </group>
    );
});
