import vertex from './shaders/visualizer/vertex.glsl'
import fragment from './shaders/visualizer/fragment.glsl'
import * as THREE from 'three'
export function addVisualizer() {
	const outerMaterial = new THREE.ShaderMaterial({
		uniforms: {
			uTime: { value: 0 },
			uFreq: { value: 0 },
			uFP: { value: 1.0 },
			uAmp: { value: 0.0 },
			uAP: { value: 1.0 },
			uLowF: { value: 0.0 },
			uLFP: { value: 1.0 },
			uMidF: { value: 0.0 },
			uMFP: { value: 1.0 },
			uHighF: { value: 0.0 },
			uHFP: { value: 1.0 },

			uColor1: { value: null },
			uColor2: { value: null },
		},
		// vertexShader: vertex,
		// fragmentShader: fragment,
		blending: THREE.AdditiveBlending,
		alphaTest: 0.001,
		depthWrite: false,
	})
}
