import portalVertexShader from './shaders/portal/vertex.glsl'
import portalFragmentShader from './shaders/portal/fragment.glsl'
import {
	PlaneGeometry,
	TextureLoader,
	ShaderMaterial,
	Vector2,
	Mesh,
} from 'three'

export default function Portal(interactables) {
	const noiseTexture = new TextureLoader().load('/tex.png')

	const portalGeometry = new PlaneGeometry(0.32, 0.45, 100, 100)
	const portalMaterial = new ShaderMaterial({
		vertexShader: portalVertexShader,
		fragmentShader: portalFragmentShader,
		uniforms: {
			uTime: { value: 0.0 },
			uResolution: {
				value: new Vector2(0.32, 0.45),
			},
			uNoiseTexture: { value: noiseTexture },
			uMouse: { value: new Vector2(0, 0) }, // Add mouse uniform
		},
	})
	const portal = new Mesh(portalGeometry, portalMaterial)
	portal.position.z = 0.67
	portal.position.y = 0.15
	interactables.push(portal)
	return portal
}
