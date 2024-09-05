import * as THREE from 'three'
import { MeshTransmissionMaterial } from './MeshTransmissionMaterial'
import { RoundedBoxGeometry } from 'three/examples/jsm/Addons.js'
// import { PlaneGeometry } from 'three/webgpu'
export function addGlass() {
	const t = new THREE.TextureLoader()
	const color = t.load('/dirt1.png')
	color.wrapS = color.wrapT = 1000
	// const geometry = new RoundedBoxGeometry(1.12, 1.12, 1.12, 16, 0.2)
	const geometry = new THREE.BoxGeometry(1, 1)
	const bg = new THREE.Mesh(
		new THREE.PlaneGeometry(
			1,
			1,
			new THREE.MeshBasicMaterial({ map: t.load('/lotusMat1.png') })
		)
	)
	bg.rotateX = Math.PI / 2

	// const geometry = new THREE.IcosahedronGeometry(1, 0)

	const material = new THREE.MeshBasicMaterial()
	const mesh = new THREE.Mesh(geometry, material)
	const m = new MeshTransmissionMaterial(6)
	// m.normalMap = t
	m.clearcoat = 0
	m.clearcoatRoughness = 0
	m.transmission = 1.0
	m.chromaticAberration = 0.03
	m.anisotrophicBlur = 0.1
	m.roughness = 0.05
	m.thickness = 0.5
	m.ior = 1.5
	m.distortion = 0.1
	m.temporalDistortion = 0.8
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
	// mesh.material = new THREE.MeshPhysicalMaterial({
	// 	roughness: 0.4,
	// 	transmission: 1,
	// 	thickness: 0.5,
	// })

	console.log(mesh.material)
	return mesh
}
