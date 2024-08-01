import waterVertexShader from './shaders/water/vertex.glsl'
import waterFragmentShader from './shaders/water/fragment.glsl'

export function ragingSeas() {
	const geometry = new PlaneGeometry(2, 2, 512, 512)
	const material = new ShaderMaterial({
		vertexShader: waterVertexShader,
		fragmentShader: waterFragmentShader,
	})
	return null
}
