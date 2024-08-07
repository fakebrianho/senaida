import { TextureLoader } from 'three'
export function addMoon() {
	let t = new TextureLoader()
	let color = t.load('/moon/Moon_COLOR.jpg')
	let normal = t.load('/moon/Moon_NORMS.jpg')
	let specular = t.load('/moon/Moon_SPEC.jpg')
	let occ = t.load('/moon/Moon_OCC.jpg')
}
