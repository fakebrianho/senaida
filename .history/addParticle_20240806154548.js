import particleVertexShader from './shaders/particles/vertex.glsl'
import particleFragmentShader from './shaders/particles/fragment.glsl'
import {
	BufferGeometry,
	Float32BufferAttribute,
	Points,
	ShaderMaterial,
	Vector3,
} from 'three'

export function createParticles(count = 1000, size = 0.1, camera) {
	const particlesGeometry = new BufferGeometry()
	const positions = new Float32Array(count * 3)
	const scales = new Float32Array(count)

	for (let i = 0; i < count * 3; i += 3) {
		positions[i] = (Math.random() - 0.5) * 10
		positions[i + 1] = (Math.random() - 0.5) * 10
		positions[i + 2] = (Math.random() - 0.5) * 10

		// Ensure particles are not too close to the camera
		if (Math.abs(positions[i + 2]) < 1.0) {
			positions[i + 2] += positions[i + 2] < 0 ? -1.0 : 1.0
		}

		scales[i / 3] = Math.random()
	}

	particlesGeometry.setAttribute(
		'position',
		new Float32BufferAttribute(positions, 3)
	)
	particlesGeometry.setAttribute(
		'aScale',
		new Float32BufferAttribute(scales, 1)
	)

	const particlesMaterial = new ShaderMaterial({
		vertexShader: particleVertexShader,
		fragmentShader: particleFragmentShader,
		uniforms: {
			uTime: { value: 0 },
			uSize: { value: size },
			uCameraPosition: { value: camera.position },
		},
		// transparent: true,
		blending: THREE.AdditiveBlending,
		depthTest: false,
		depthWrite: false,
	})

	const particles = new Points(particlesGeometry, particlesMaterial)
	return particles
}
