import { SphereGeometry } from 'three'

export function addCursor(cursor) {
	const geometry = new SphereGeometry(0.1, 16, 16)
	const material = new MeshBasicMaterial({ color: 0x00ff00 })
	const sphere = new Mesh(geometry, material)
	return sphere
}
