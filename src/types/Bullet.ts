import * as THREE from 'three'

export interface Bullet {
  id: number
  position: THREE.Vector3
  velocity: THREE.Vector3
  life: number
}
