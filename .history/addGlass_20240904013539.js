import * as THREE from 'three'
import { MeshTransmissionMaterial } from './MeshTransmissionMaterial'
export function addGlass() {
	const geometry = new THREE.BoxGeometry(1, 1)
	const material = new MeshTransmissionMaterial({
		clearcoat: 1,
		clearcoatRoughness: 0,
		transmission: 1,
		chromaticAberration: 0.03,
		anisotrophicBlur: 0.1,
		// Set to > 0 for diffuse roughness
		roughness: 0,
		thickness: 4.5,
		ior: 1.5,
		// Set to > 0 for animation
		distortion: 0.1,
		distortionScale: 0.2,
		temporalDistortion: 0.2,
	})
	const mesh = new THREE.Mesh(geometry, material)
	return mesh
}
