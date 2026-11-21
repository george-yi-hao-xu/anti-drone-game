import * as THREE from 'three'

export type DroneProfile = 'direct' | 'weave' | 'skimmer'

export interface Drone {
  id: number
  spawnAt: number
  profile: DroneProfile
  start: THREE.Vector3
  position: THREE.Vector3
  speed: number
  progress: number
  active: boolean
  destroyed: boolean
  phase: number
}
