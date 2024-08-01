import portalVertexShader from './shaders/portal/vertex.glsl'
import portalFragmentShader from './shaders/portal/fragment.glsl'
import { PlaneGeometry } from 'three'

export default function Portal() {
	const noiseTexture = new THREE.TextureLoader().load('/tex.png')

	const portalGeometry = new PlaneGeometry(2, 2, 100, 100)
	const portalMaterial = new THREE.ShaderMaterial({
		vertexShader: portalVertexShader,
		fragmentShader: portalFragmentShader,
		uniforms: {
			uTime: { value: 0.0 },
			uResolution: {
				value: new THREE.Vector2(window.innerWidth, window.innerHeight),
			},
			uNoiseTexture: { value: noiseTexture },
		},
	})
	return (
		<mesh>
			<planeGeometry args={[1, 1]} />
			<shaderMaterial
				vertexShader={portalVertexShader}
				fragmentShader={portalFragmentShader}
			/>
		</mesh>
	)
}
