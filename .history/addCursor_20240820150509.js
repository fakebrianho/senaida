import { SphereGeometry, Mesh, MeshBasicMaterial } from 'three'

export function addCursor(cursor) {
	const geometry = new SphereGeometry(0.2, 16, 16)
	const material = new MeshBasicMaterial({ color: 0x00ff00 })
	const sphere = new Mesh(geometry, material)
	return sphere
}
