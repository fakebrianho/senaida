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
	const color = loadTexture('/obsidian/Obsidian_001_basecolor.jpg')
	const height = loadTexture('/obsidian/Obsidian_001_height.png')
	const roughness = loadTexture('/obsidian/Obsidian_001_roughness.jpg')
	const normal = loadTexture('/obsidian/Obsidian_001_normal.jpg')
	const box = new THREE.SphereGeometry(20, 400, 400, 400)
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
