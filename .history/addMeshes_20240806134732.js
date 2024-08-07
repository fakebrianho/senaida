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
	const color = loadTexture('/obsidian2/COLOR.png')
	const height = loadTexture('/obsidian2/HEIGHT.png')
	const roughness = loadTexture('/obsidian2/ROUGHNESS.png')
	const normal = loadTexture('/ice/Stylized_Ice_001_roughness.png')
	const box = new THREE.SphereGeometry(0.05, 400, 400, 400)
	const sphereMaterial = new THREE.MeshStandardMaterial({
		map: color,
		displacementMap: height,
		displacementScale: 0.1,
		// roughnessMap: roughness,
		metalness: 1.0,
		roughness: 0.4,
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
