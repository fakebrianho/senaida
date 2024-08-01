import portalVertexShader from './shaders/portal/vertex.glsl'
import portalFragmentShader from './shaders/portal/fragment.glsl'

export default function Portal() {
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
