import * as THREE from 'three'
import { MeshTransmissionMaterial } from './MeshTransmissionMaterial'
import { RoundedBoxGeometry } from 'three/examples/jsm/Addons.js'
export function addGlass() {
	const t = new THREE.TextureLoader()
	const color = t.load('/dirt1.png')
	color.wrapS = color.wrapT = 1000
	const geometry = new RoundedBoxGeometry(1.12, 1.12, 1.12, 16, 0.2)
	const material = new THREE.MeshBasicMaterial()
	const mesh = new THREE.Mesh(geometry, material)
	const m = new MeshTransmissionMaterial(10)
	// m.normalMap = t
	m.clearcoat = 1
	m.clearcoatRoughness = 0
	m.transmission = 1
	m.chromaticAberration = 0.03
	m.anisotrophicBlur = 0.1
	m.roughness = 0.05
	m.thickness = 4.5
	m.ior = 1.5
	m.distortion = 0.9
	m.temporalDistortion = 0.2
	mesh.material = m
	// mesh.material = Object.assign(new MeshTransmissionMaterial(10), {
	// 	clearcoat: 1,
	// 	clearcoatRoughness: 0,
	// 	transmission: 1,
	// 	chromaticAberration: 0.03,
	// 	anisotrophicBlur: 0.1,
	// 	// Set to > 0 for diffuse roughness
	// 	roughness: 0.05,
	// 	thickness: 4.5,
	// 	ior: 1.5,

	// 	// Set to > 0 for animation
	// 	distortion: 0.1,
	// 	distortionScale: 0.2,
	// 	temporalDistortion: 0.2,
	// })
	// mesh.material.normalMap = t
	console.log(mesh.material)
	return mesh
}
