import * as THREE from 'three'

const textureLoader = new THREE.TextureLoader()
function loadTexture(url) {
	const texture = textureLoader.load(url)
	texture.minFilter = THREE.LinearFilter
	texture.magFilter = THREE.LinearFilter
	texture.wrapS = THREE.RepeatWrapping
	texture.wrapT = THREE.RepeatWrapping
	return texture
}
export function addBoilerPlateMesh() {
	const color = loadTexture('/ice/Stylized_Ice_001_basecolor.png')
	const height = loadTexture('/ice/Stylized_Ice_001_height.png')
	const roughness = loadTexture('/ice/Stylized_Ice_roughness.png')
	const normal = loadTexture('/ice/Stylized_Ice_001_roughness.png')
	const box = new THREE.SphereGeometry(0.5, 400, 400, 400)
	const sphereMaterial = new THREE.MeshStandardMaterial({
		map: color,
		displacementMap: height,
		displacementScale: 1.0,
		roughnessMap: roughness,
		normalMap: normal,
	})
	const boxMesh = new THREE.Mesh(box, sphereMaterial)
	boxMesh.position.set(2, 0, 0)
	return boxMesh
}

export function addStandardMesh() {
	const box = new THREE.BoxGeometry(1, 1, 1)
	const boxMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 })
	const boxMesh = new THREE.Mesh(box, boxMaterial)
	boxMesh.position.set(-2, 0, 0)
	return boxMesh
}
