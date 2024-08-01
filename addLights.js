import * as THREE from 'three'

export function addLight() {
	const light = new THREE.DirectionalLight(0xffffff, 3)
	light.position.set(1, 1, 1)
	return light
}

export function addAmbient() {
	const ambient = new THREE.AmbientLight(0xffffff, 1)
	return ambient
}
