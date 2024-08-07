import { TextureLoader } from 'three'
export function addMoon() {
	let t = new TextureLoader()
	let color = t.load('/moon/Moon_COLOR.jpg')
	let normal = t.load('/moon/Moon_NORMS.jpg')
	let specular = t.load('/moon/Moon_SPEC.jpg')
	let occ = t.load('/moon/Moon_OCC.jpg')
	let disp = t.load('/moon/Moon_DISP.png')
	let moon = new Mesh(
		new SphereGeometry(1, 16, 16),
		new MeshStandardMaterial({
			color,
			normalMap: normal,
			specularMap: specular,
			occlusionMap: occ,
			displacementMap: disp,
			displacementScale: 0.02,
		})
	)
}
