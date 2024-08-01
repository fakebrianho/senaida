import portalVertexShader from './shaders/portal/vertex.glsl'
import portalFragmentShader from './shaders/portal/fragment.glsl'

export default function Portal() {
	const shaderMaterial = new THREE.ShaderMaterial({
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
