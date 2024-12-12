import vertex from './shaders/visualizer/vertex.glsl'
import fragment from './shaders/visualizer/fragment.glsl'
import oVertex from './shaders/visualizer/outerVertex.glsl'
import oFragment from './shaders/visualizer/outerFragment.glsl'
import mFragment from './shaders/visualizer/matcapFragment.glsl'
import * as THREE from 'three'

export function addVisualizer(url, lowfi, num) {
	const t = new THREE.TextureLoader()
	t.load(
		'/lotusMat4.png',
		(texture) => {
			console.log('Texture loaded successfully')
		},
		undefined,
		(error) => {
			console.error('Error loading texture:', error)
		}
	)
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

			uColor1: { value: new THREE.Color(0x008080) },
			uColor2: { value: new THREE.Color(0xffffff) },
		},
		vertexShader: vertex,
		fragmentShader: fragment,
		// blending: THREE.AdditiveBlending,
		alphaTest: 0.001,
		depthWrite: false,
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
		// wireframe: true,
		vertexShader: oVertex,
		fragmentShader: oFragment,
	})
	const depthRenderTarget = new THREE.WebGLRenderTarget(
		window.innerWidth,
		window.innerHeight,
		{
			format: THREE.RGBAFormat,
			type: THREE.FloatType,
		}
	)
	const matMaterial = new THREE.ShaderMaterial({
		uniforms: {
			matcapTexture: { value: t.load('/lotusMat4.png') },
			uTime: { value: 0 },
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
			u_matcapTextures: { value: t.load('/lotusMat2.png') },
			u_depthTexture: { value: depthRenderTarget }, // Will need to set up a depth render target
			u_resolution: {
				value: new THREE.Vector2(window.innerWidth, window.innerHeight),
			},
			u_transparency: { value: 1.0 },
			u_refractPower: { value: 0.0 },
			u_cameraPosition: { value: new THREE.Vector3(0, 0, 25) },
			uColor1: { value: new THREE.Color(0x008080) },
			uColor2: { value: new THREE.Color(0xffffff) },
		},
		wireframe: true,
		vertexShader: oVertex,
		fragmentShader: mFragment,
		transparent: true,
		depthWrite: false,
	})
	const sphere = new THREE.Points(
		new THREE.SphereGeometry(0.3, 64, 64),
		innerMaterial
	)
	sphere.geometry.setAttribute(
		'uv2',
		new THREE.BufferAttribute(sphere.geometry.attributes.uv.array, 2)
	)
	const outerGeometry = new THREE.SphereGeometry(0.38, 64, 64)
	const outerMesh = new THREE.Mesh(outerGeometry, matMaterial)
	outerMesh.userData.url = `${url}.wav`
	outerMesh.userData.lf = `${lowfi}.wav`
	outerMesh.userData.num = num

	const color = t.load('/ice/Stylized_Ice_001_basecolor.png')
	const ao = t.load('/Stylized_Ice_001_ambientOcclusion.png')
	const roughness = t.load('/Stylized_Ice_001_roughness.png')
	const height = t.load('/ice/Stylized_Ice_001_height.png')
	const normal = t.load('/ice/Stylized_Ice_001_normal.png')
	const iceGeometry = new THREE.SphereGeometry(0.38, 128, 128)
	const iceMaterial = new THREE.MeshStandardMaterial({
		map: color,
		aoMap: ao,
		aoMapIntensity: 1.0, // Add this line
		roughnessMap: roughness,
		displacementMap: height,
		normalMap: normal,
	})
	console.log('AO Texture:', ao)
	iceGeometry.setAttribute(
		'uv2',
		new THREE.BufferAttribute(iceGeometry.attributes.uv.array, 2)
	)
	const ice = new THREE.Mesh(iceGeometry, iceMaterial)

	return { inner: sphere, outer: ice }
}
