import portalVertexShader from './shaders/portal/vertex.glsl'
import portalFragmentShader from './shaders/portal/fragment.glsl'
import {
	PlaneGeometry,
	TextureLoader,
	ShaderMaterial,
	Vector2,
	Mesh,
} from 'three'

export default function Portal() {
	const noiseTexture = new TextureLoader().load('/tex.png')

	const portalGeometry = new PlaneGeometry(2, 2, 100, 100)
	const portalMaterial = new ShaderMaterial({
		vertexShader: portalVertexShader,
		fragmentShader: portalFragmentShader,
		uniforms: {
			uTime: { value: 0.0 },
			uResolution: {
				value: new Vector2(window.innerWidth, window.innerHeight),
			},
			uNoiseTexture: { value: noiseTexture },
		},
	})
	const portal = new Mesh(portalGeometry, portalMaterial)
	portal.position.z = 0.67
	return portal
}
