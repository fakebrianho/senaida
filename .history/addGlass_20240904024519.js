import * as THREE from 'three'
import { MeshTransmissionMaterial } from './MeshTransmissionMaterial'
export function addGlass() {
	const t = new THREE.TextureLoader()
	const color = t.load('/dirt1.png')
	color.wrapS = color.wrapT = 1000
	const geometry = new THREE.BoxGeometry(1, 1)
	const material = new THREE.MeshBasicMaterial()
	const mesh = new THREE.Mesh(geometry, material)
	mesh.material = Object.assign(new MeshTransmissionMaterial(10), {
		clearcoat: 1,
		clearcoatRoughness: 0,
		transmission: 1,
		chromaticAberration: 0.03,
		anisotrophicBlur: 0.1,
		// Set to > 0 for diffuse roughness
		roughness: 0.05,
		thickness: 4.5,
		ior: 1.5,
		// Set to > 0 for animation
		distortion: 0.1,
		distortionScale: 0.2,
		temporalDistortion: 0.2,
	})
	return mesh
}
