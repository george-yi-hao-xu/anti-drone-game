import * as THREE from "three";

export interface Tracer {
    id: number;
    start: THREE.Vector3;
    end: THREE.Vector3;
    life: number;
}
