import {
	TextureLoader,
	Mesh,
	MeshStandardMaterial,
	SphereGeometry,
} from 'three'
export function addMoon(props) {
	let t = new TextureLoader()
	let color = t.load('/moon/Moon_COLOR.jpg')
	let normal = t.load('/moon/Moon_NORM.jpg')
	let specular = t.load('/moon/Moon_SPEC.jpg')
	let occ = t.load('/moon/Moon_OCC.jpg')
	let disp = t.load('/moon/Moon_DISP.png')
	let moon = new Mesh(
		new SphereGeometry(0.2, 64, 64),
		new MeshStandardMaterial({
			color,
			normalMap: normal,
			specularMap: specular,
			occlusionMap: occ,
			displacementMap: disp,
			displacementScale: 0.02,
		})
	)
	moon.position.set(...props.position)
	return moon
}
