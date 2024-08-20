import { SphereGeometry, Mesh, MeshBasicMaterial } from 'three'

export function addCursor(cursor) {
	const geometry = new SphereGeometry(0.01, 16, 16)
	const material = new MeshBasicMaterial({ color: 0x000000 })
	const sphere = new Mesh(geometry, material)
	sphere.position.set(0, 0, 0.5)
	return sphere
}
