// import './style.css'
import * as THREE from 'three'
import { addBoilerPlateMesh } from './addMeshes'
import Model from './Model'
import { HDRI } from './environment'
import { manager } from './manager'
import { OrbitControls } from 'three/examples/jsm/Addons.js'
import { postprocessing } from './postprocessing'
import { addGlass } from './addGlass'
import { addVisualizer } from './addVisualizer'
import { analyzeAudio } from './analyzeAudio'

const scene = new THREE.Scene()
const renderer = new THREE.WebGLRenderer({ antialias: true })
scene.background = new THREE.Color('#000000')

renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.outputEncoding = THREE.sRGBEncoding // renderer.toneMappingExposure = 4.5

renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
const camera = new THREE.PerspectiveCamera(
	15,
	window.innerWidth / window.innerHeight,
	0.1,
	100
)
camera.position.set(0, 0, 25)

//Globals
let analyser
const meshes = {}
let active = null
let prev = null
const clock = new THREE.Clock()
const interactables = []
let loadedFlag = false
const loadManager = manager(
	() => {
		loadedFlag = true
	},
	camera,
	2
)
const raycaster = new THREE.Raycaster()
const mouse = new THREE.Vector2()
const controls = new OrbitControls(camera, renderer.domElement)
const defaultVector = new THREE.Vector2(0.5, 0.5)
let targetMouse = new THREE.Vector2()
let audioFlag = false
let currentMouse = new THREE.Vector2(0.5, 0.5)
const mouseVector = new THREE.Vector3(0, 0, 0.5)
const PARAMS = {
	frequency: 0.0,
	amplitude: 0.0,
	low: 0.0,
	mid: 0.0,
	upper: 0.0,
}

const composer = postprocessing(scene, camera, renderer)

init()
function init() {
	renderer.setSize(window.innerWidth, window.innerHeight)
	document.body.appendChild(renderer.domElement)

	//meshes
	meshes.default = addBoilerPlateMesh()
	meshes.glass = addGlass()
	meshes.visualizer1 = addVisualizer('song1', 1)
	meshes.visualizer2 = addVisualizer('song2', 2)

	//
	meshes.visualizer1.inner.position.set(0, 1.5, 0)
	meshes.visualizer1.outer.position.set(0, 1.5, 0)
	meshes.visualizer2.inner.position.set(-2.5, 0.0, 0)
	meshes.visualizer2.outer.position.set(-2.5, 0.0, 0)
	interactables.push(meshes.visualizer1.inner)
	interactables.push(meshes.visualizer1.outer)
	interactables.push(meshes.visualizer2.inner)
	interactables.push(meshes.visualizer2.outer)

	meshes.glass.position.set(0, 0, -0.75)

	scene.environment = HDRI(loadManager, '/hdri5.hdr')
	//lights

	meshes.default.position.set(0, 0.2, 1.25)

	//scene operations
	scene.add(meshes.glass)
	scene.add(meshes.visualizer1.inner)
	scene.add(meshes.visualizer1.outer)
	scene.add(meshes.visualizer2.inner)
	scene.add(meshes.visualizer2.outer)

	instances()
	setupPost()
	resize()
	listeners()
	animate()
}

function setupPost() {
	composer.bloom.strength = 0.7
	composer.bloom.threshold = 0.1
	composer.bloom.radius = 0.5
}

function instances() {
	const lotus = new Model({
		name: 'lotus',
		meshes: meshes,
		scene: scene,
		url: '/lotus.glb',
		outline: true,
		replace: true,
		replaceURL: '/lotusMat4.png',
		scale: new THREE.Vector3(0.15, 0.15, 0.15),
		position: new THREE.Vector3(0, -0.2, -0.7),
		manager: loadManager,
	})
	lotus.init()
}

function resize() {
	window.addEventListener('resize', () => {
		renderer.setSize(window.innerWidth, window.innerHeight)
		camera.aspect = window.innerWidth / window.innerHeight
		camera.updateProjectionMatrix()
	})
}

function onMouseMove(event) {
	mouse.x = (event.clientX / window.innerWidth) * 2 - 1
	mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
	raycaster.setFromCamera(mouse, camera)
	const intersects = raycaster.intersectObjects(interactables)
	if (intersects.length > 0) {
		if (!audioFlag) {
			analyser = analyzeAudio()
			analyser.swapSongs(intersects[0].object.userData.url)
			analyser.initAudio()
			prev = active
			active = intersects[0].object.userData.num
			audioFlag = true
		} else {
			analyser.swapSongs(intersects[0].object.userData.url)
			prev = active
			active = intersects[0].object.userData.num
			if (prev !== null) {
				const vis = meshes[`visualizer${prev}`]
				if (vis) {
					vis.inner.material.uniforms.uAmp.value = PARAMS.amplitude
					vis.inner.material.uniforms.uFreq.value = PARAMS.frequency
					vis.inner.material.uniforms.uLowF.value = PARAMS.low
					vis.inner.material.uniforms.uMidF.value = PARAMS.mid
					vis.inner.material.uniforms.uHighF.value = PARAMS.upper
					vis.outer.material.uniforms.uAmp.value = PARAMS.amplitude
					vis.outer.material.uniforms.uFreq.value = PARAMS.frequency
					vis.outer.material.uniforms.uLowF.value = PARAMS.low
					vis.outer.material.uniforms.uMidF.value = PARAMS.mid
					vis.outer.material.uniforms.uHighF.value = PARAMS.upper
				}
			}
		}
	}
}

function listeners() {
	window.addEventListener('click', onMouseMove)
	window.addEventListener('click', () => {
		if (!audioFlag) {
			try {
				analyser = analyzeAudio()
				audioFlag = true
			} catch (error) {
				console.error('Error analyzing audio:', error)
			}
		}
	})
}

function animate() {
	requestAnimationFrame(animate)
	const eT = clock.getElapsedTime()

	if (audioFlag && meshes[`visualizer${active}`]) {
		const data = analyser.analyze()
		const vis = meshes[`visualizer${active}`]
		vis.outer.rotation.x += 0.02
		vis.inner.rotation.z -= 0.01
		vis.inner.material.uniforms.uTime.value = eT
		vis.inner.material.uniforms.uFreq.value = data.frequency
		vis.inner.material.uniforms.uAmp.value = data.amplitude
		vis.outer.material.uniforms.uTime.value = eT
		vis.outer.material.uniforms.uFreq.value = data.frequency
		vis.outer.material.uniforms.uAmp.value = data.amplitude
	}

	if (meshes.lotus) {
		meshes.lotus.rotation.y += 0.0025
	}
	if (meshes.glass) {
		meshes.glass.rotation.y -= 0.0025
	}
	composer.composer.render()
}
