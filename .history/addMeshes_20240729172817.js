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
	const color = textureLoader.load('/obsidian/Obsidian_001_basecolor.jpg')
	const height = textureLoader.load('/obsidian/Obsidian_001_height.png')
	const roughness = textureLoader.load('/obsidian/Obsidian_001_roughness.jpg')
	const normal = textureLoader.load('/obsidian/Obsidian_001_normal.jpg')
	const ao = textureLoader.load('/obsidian/Obsidian_001_ambientOcclusion.jpg')
	const box = new THREE.SphereGeometry(0.5, 400, 400, 400)
	const boxMaterial = new THREE.MeshBasicMaterial({
		map: color,
		// displacementMap: height,
		// wireframe: true,
		// displacementScale: 0.4,
		// roughnessMap: roughness,
		// normalMap: normal,
		// aoMap: ao,
	})
	const boxMesh = new THREE.Mesh(box, boxMaterial)
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
