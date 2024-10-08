import waterVertexShader from './shaders/water/vertex.glsl'
import waterFragmentShader from './shaders/water/fragment.glsl'
import { PlaneGeometry, ShaderMaterial, Vector2, Color, Mesh } from 'three'

export function ragingSeas() {
	const debugObject = {}
	// debugObject.depthColor = '#ff4000'
	debugObject.surfaceColor = '#000000'
	debugObject.depthColor = '#414a4c'

	const waterGeometry = new PlaneGeometry(4, 8, 1028, 1028)
	const waterMaterial = new ShaderMaterial({
		vertexShader: waterVertexShader,
		fragmentShader: waterFragmentShader,
		uniforms: {
			uTime: { value: 0 },

			uBigWavesElevation: { value: 0.025 },
			uBigWavesFrequency: { value: new Vector2(2, 1.0) },
			uBigWavesSpeed: { value: 0.5 },

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
	water.position.z = -0.1
	return water

	const material = new ShaderMaterial({
		vertexShader: waterVertexShader,
		fragmentShader: waterFragmentShader,
	})
	return null
}
