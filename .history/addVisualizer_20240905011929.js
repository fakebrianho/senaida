import vertex from './shaders/visualizer/vertex.glsl'
import fragment from './shaders/visualizer/fragment.glsl'
// import oVertex
import * as THREE from 'three'
export function addVisualizer() {
	const innerMaterial = new THREE.ShaderMaterial({
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

			uColor1: { value: new THREE.Color(0xff0000) },
			uColor2: { value: new THREE.Color(0xffff00) },
		},
		vertexShader: vertex,
		fragmentShader: fragment,
		// blending: THREE.AdditiveBlending,
		// alphaTest: 0.001,
		// depthWrite: false,
	})
	const outerMaterial = new THREE.ShaderMaterial({
		uniforms: {
			uTime: { value: 1.0 },
			uFreq: { value: 0.0 },
			uFP: { value: 1.0 },
			uAmp: { value: 0.0 },
			uAP: { value: 1.0 },
			uLowF: { value: 0.0 },
			uLFP: { value: 1.0 },
			uMidF: { value: 0.0 },
			uMFP: { value: 1.0 },
			uHighF: { value: 0.0 },
			uHFP: { value: 1.0 },
			resolution: { value: new THREE.Vector2() },
		},
		wireframe: true,
		vertexShader: v3,
		fragmentShader: f3,
	})
	const sphere = new THREE.Points(
		new THREE.SphereGeometry(0.75, 168, 168),
		innerMaterial
	)
	sphere.geometry.setAttribute(
		'uv2',
		new THREE.BufferAttribute(sphere.geometry.attributes.uv.array, 2)
	)
	return sphere
}
