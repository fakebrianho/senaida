import particleVertexShader from './shaders/particles/vertex.glsl'
import particleFragmentShader from './shaders/particles/fragment.glsl'
import {
	BufferGeometry,
	Float32BufferAttribute,
	Points,
	ShaderMaterial,
	Vector3,
} from 'three'

export function createParticles(count = 1000, size = 0.1) {
	const particlesGeometry = new BufferGeometry()
	const positions = new Float32Array(count * 3)
	const velocities = new Float32Array(count * 3)

	for (let i = 0; i < count * 3; i += 3) {
		positions[i] = (Math.random() - 0.5) * 10
		positions[i + 1] = (Math.random() - 0.5) * 10
		positions[i + 2] = (Math.random() - 0.5) * 10

		velocities[i] = (Math.random() - 0.5) * 0.01
		velocities[i + 1] = (Math.random() - 0.5) * 0.01
		velocities[i + 2] = (Math.random() - 0.5) * 0.01
	}

	particlesGeometry.setAttribute(
		'position',
		new Float32BufferAttribute(positions, 3)
	)
	particlesGeometry.setAttribute(
		'velocity',
		new Float32BufferAttribute(velocities, 3)
	)

	const particlesMaterial = new ShaderMaterial({
		vertexShader: particleVertexShader,
		fragmentShader: particleFragmentShader,
		uniforms: {
			uTime: { value: 0 },
			uSize: { value: size },
			uColor: { value: new Vector3(1.0, 0.5, 0.1) },
		},
		transparent: true,
		depthWrite: true,
	})

	const particles = new Points(particlesGeometry, particlesMaterial)
	return particles
}
