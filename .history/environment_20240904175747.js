import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'
import { EquirectangularReflectionMapping } from 'three'

export function HDRI(manager) {
	const rgbeLoader = new RGBELoader(manager)
	const hdrMap = rgbeLoader.load('hdri4.hdr', (envMap) => {
		envMap.mapping = EquirectangularReflectionMapping
		return envMap
	})
	return hdrMap
}
