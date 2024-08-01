import waterVertexShader from './shaders/water/vertex.glsl'
import waterFragmentShader from './shaders/water/fragment.glsl'
import { PlaneGeometry, ShaderMaterial, Vector2, Color, Mesh } from 'three'

export function ragingSeas() {
	const debugObject = {}
	debugObject.depthColor = '#ff4000'
	debugObject.surfaceColor = '#151c37'

	const waterGeometry = new PlaneGeometry(4, 2, 1028, 1028)
	const waterMaterial = new ShaderMaterial({
		vertexShader: waterVertexShader,
		fragmentShader: waterFragmentShader,
		uniforms: {
			uTime: { value: 0 },

			uBigWavesElevation: { value: 0.1 },
			uBigWavesFrequency: { value: new Vector2(4, 1.5) },
			uBigWavesSpeed: { value: 0.75 },

			uSmallWavesElevation: { value: 0.07 },
			uSmallWavesFrequency: { value: 3 },
			uSmallWavesSpeed: { value: 0.2 },
			uSmallIterations: { value: 4 },

			uDepthColor: { value: new Color(debugObject.depthColor) },
			uSurfaceColor: { value: new Color(debugObject.surfaceColor) },
			uColorOffset: { value: 0.925 },
			uColorMultiplier: { value: 1 },
		},
	})
	const water = new Mesh(waterGeometry, waterMaterial)
	water.rotation.x = -Math.PI * 0.5
	water.position.z = -0.2
	return water

	const material = new ShaderMaterial({
		vertexShader: waterVertexShader,
		fragmentShader: waterFragmentShader,
	})
	return null
}
