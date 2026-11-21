import { makeAutoObservable } from "mobx";
import * as THREE from "three";
import { MISSION } from "../constants";
import type { Drone, DroneProfile } from "../types/Drone";
import type { Bullet } from "../types/Bullet";
import type { Burst } from "../types/Burst";

export function createDrones(): Drone[] {
  return Array.from({ length: MISSION.droneCount }, (_, id) => {
    const phase = id < 6 ? 0 : id < 14 ? 1 : 2
    const localIndex = phase === 0 ? id : phase === 1 ? id - 6 : id - 14
    const phaseStart = [4, 31, 59][phase]
    const phaseSpan = [24, 25, 28][phase]
    const count = [6, 8, 10][phase]
    const spawnAt = phaseStart + (localIndex * phaseSpan) / Math.max(1, count - 1)
    const angle = ((id * 137.5 + 25) * Math.PI) / 180
    const radius = 105 + ((id * 17) % 35)
    const profile: DroneProfile = phase === 0
      ? 'direct'
      : id % 3 === 0
        ? 'skimmer'
        : id % 2 === 0 ? 'weave' : 'direct'
    const y = profile === 'skimmer' ? 4 + (id % 3) : 13 + (id % 5) * 2.5
    const start = new THREE.Vector3(Math.sin(angle) * radius, y, -Math.cos(angle) * radius)

    return {
      id,
      spawnAt,
      profile,
      start,
      position: start.clone(),
      speed: 10.2 + phase * 1.1 + (id % 4) * 0.35,
      progress: 0,
      active: false,
      destroyed: false,
      phase: (id * 1.73) % 6.28,
    }
  })
}

export class RuntimeStore {
    drones: Drone[] = createDrones();
    bullets: Bullet[] = [];
    bursts: Burst[] = [];

    revision = 0;
    elapsed = 0;
    yaw = 0;
    pitch = 0;
    fireHeld = false;
    reloadEnd = 0;
    recoil = 0;
    cameraShake = 0;
    lastHud = 0;
    lastShot = -1;
    ended = false;

    constructor() {
        makeAutoObservable(this, {
            drones: false,
            bullets: false,
            bursts: false,
        });
    }

    reset() {
        this.drones = createDrones();
        this.bullets = [];
        this.bursts = [];
        this.revision += 1;
        this.elapsed = 0;
        this.yaw = 0;
        this.pitch = 0;
        this.fireHeld = false;
        this.reloadEnd = 0;
        this.recoil = 0;
        this.cameraShake = 0;
        this.lastHud = 0;
        this.lastShot = -1;
        this.ended = false;
    }

    advance(delta: number) {
        this.elapsed += Math.max(0, delta);
    }
}

export const runtime = new RuntimeStore();
