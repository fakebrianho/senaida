import * as THREE from 'three'
import { MeshTransmissionMaterial } from './MeshTransmissionMaterial'
export function addGlass() {
	const geometry = new THREE.BoxGeometry(1, 1)
	const material = new THREE.MeshBasicMaterial()
	const mesh = new THREE.Mesh(geometry, material)
	mesh.material = Object.assign(new MeshTransmissionMaterial(10), {})
	return mesh
}
