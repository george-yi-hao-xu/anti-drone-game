import { makeAutoObservable } from "mobx";
import * as THREE from "three";
import { INITIAL_VIEW_PITCH, MISSION } from "~/constants";
import type { Drone, DroneProfile } from "~/types/Drone";
import type { Burst } from "~/types/Burst";
import type { Tracer } from "~/types/Tracer";

const PHASE_HALF_ARCS = [30, 45, 60] as const;
const DRONE_SPAWN_MIN_RADIUS = 170;
const DRONE_SPAWN_RADIUS_VARIATION = 35;

export function createDrones(): Drone[] {
  return Array.from({ length: MISSION.droneCount }, (_, id) => {
    const phase = id < 6 ? 0 : id < 14 ? 1 : 2
    const localIndex = phase === 0 ? id : phase === 1 ? id - 6 : id - 14

    const phaseStart = MISSION.phaseStart[phase]
    const phaseSpan = MISSION.phaseSpan[phase]

    const count = [6, 8, 10][phase]
    const spawnAt = phaseStart + (localIndex * phaseSpan) / Math.max(1, count - 1)
    const halfArc = PHASE_HALF_ARCS[phase]
    const sweepStart = phase % 2 === 0 ? -halfArc : halfArc
    const sweepEnd = -sweepStart
    const angleDegrees = THREE.MathUtils.lerp(
      sweepStart,
      sweepEnd,
      localIndex / Math.max(1, count - 1),
    )
    const angle = THREE.MathUtils.degToRad(angleDegrees)
    const radius =
      DRONE_SPAWN_MIN_RADIUS + ((id * 17) % DRONE_SPAWN_RADIUS_VARIATION)
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
      breached: false,
      phase: (id * 1.73) % 6.28,
    }
  })
}

export class RuntimeStore {
    drones: Drone[] = createDrones();
    tracers: Tracer[] = [];
    bursts: Burst[] = [];

    revision = 0;
    effectRevision = 0;
    nextEffectId = 1;
    elapsed = 0;
    yaw = 0;
    pitch = INITIAL_VIEW_PITCH;
    fireHeld = false;
    aiming = false;
    aimProgress = 0;
    reloadEnd = 0;
    recoil = 0;
    muzzleFlash = 0;
    cameraShake = 0;
    lastHud = 0;
    lastShot = -1;
    ended = false;

    constructor() {
        makeAutoObservable(this, {
            drones: false,
            tracers: false,
            bursts: false,
        });
    }

    reset() {
        this.drones = createDrones();
        this.tracers = [];
        this.bursts = [];
        this.revision += 1;
        this.effectRevision += 1;
        this.nextEffectId = 1;
        this.elapsed = 0;
        this.yaw = 0;
        this.pitch = INITIAL_VIEW_PITCH;
        this.fireHeld = false;
        this.aiming = false;
        this.aimProgress = 0;
        this.reloadEnd = 0;
        this.recoil = 0;
        this.muzzleFlash = 0;
        this.cameraShake = 0;
        this.lastHud = 0;
        this.lastShot = -1;
        this.ended = false;
    }

    advance(delta: number) {
        this.elapsed += Math.max(0, delta);
    }

    setAim(yaw: number, pitch: number) {
        this.yaw = yaw;
        this.pitch = pitch;
    }

    setFireHeld(held: boolean) {
        this.fireHeld = held;
    }

    setAiming(aiming: boolean) {
        this.aiming = aiming;
    }

    updateAim(delta: number) {
        const target = this.aiming ? 1 : 0;
        const blend = 1 - Math.exp(-Math.max(0, delta) * 12);
        this.aimProgress += (target - this.aimProgress) * blend;

        if (Math.abs(target - this.aimProgress) < 0.001) {
            this.aimProgress = target;
        }
    }

    registerShot() {
        this.lastShot = this.elapsed;
        this.recoil = Math.min(0.11, this.recoil + MISSION.recoilKick);
        this.muzzleFlash = 0.045;
    }

    beginReload() {
        this.fireHeld = false;
        this.aiming = false;
        this.reloadEnd = this.elapsed + MISSION.reloadSeconds;
    }

    addTracer(start: THREE.Vector3, end: THREE.Vector3) {
        this.tracers.push({
            id: this.nextEffectId++,
            start: start.clone(),
            end: end.clone(),
            life: MISSION.tracerSeconds,
        });
        this.effectRevision += 1;
    }

    addBurst(position: THREE.Vector3, unsafe = false) {
        this.bursts.push({
            id: this.nextEffectId++,
            position: position.clone(),
            life: MISSION.burstSeconds,
            unsafe,
        });
        this.effectRevision += 1;
    }

    triggerCameraShake(amount: number) {
        this.cameraShake = Math.max(this.cameraShake, Math.max(0, amount));
    }

    updateEffects(delta: number) {
        this.muzzleFlash = Math.max(0, this.muzzleFlash - delta);
        this.recoil = Math.max(0, this.recoil - delta * 0.12);
        this.cameraShake = Math.max(0, this.cameraShake - delta * 0.65);

        const tracerCount = this.tracers.length;
        const burstCount = this.bursts.length;
        this.tracers.forEach((tracer) => {
            tracer.life -= delta;
        });
        this.bursts.forEach((burst) => {
            burst.life -= delta;
        });
        this.tracers = this.tracers.filter((tracer) => tracer.life > 0);
        this.bursts = this.bursts.filter((burst) => burst.life > 0);

        if (tracerCount !== this.tracers.length || burstCount !== this.bursts.length) {
            this.effectRevision += 1;
        }
    }
}

export const runtime = new RuntimeStore();
