import * as THREE from 'three'

export interface Burst {
  id: number
  position: THREE.Vector3
  life: number
  unsafe: boolean
}