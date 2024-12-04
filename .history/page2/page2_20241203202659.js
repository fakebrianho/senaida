// import './style.css'
import * as THREE from 'three'
import { addBoilerPlateMesh } from '../addMeshes'
import Model from '../Model'
import { HDRI } from '../environment'
import { manager } from '../manager'
import { OrbitControls } from 'three/examples/jsm/Addons.js'
import { postprocessing } from '../postprocessing'
import { addGlass } from '../addGlass'
import { addVisualizer } from '../addVisualizer'
import { analyzeAudio } from '../analyzeAudio'
import { Pane } from 'tweakpane'

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
const visualizers = {}
const visGroup = new THREE.Group()
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
	meshes.visualizer3 = addVisualizer('song3', 3)
	meshes.visualizer4 = addVisualizer('song4', 4)
	meshes.visualizer5 = addVisualizer('song5', 5)
	meshes.visualizer6 = addVisualizer('song6', 6)

	console.log(meshes.visualizer1)
	visGroup.add(meshes.visualizer1.inner)
	visGroup.add(meshes.visualizer1.outer)
	visGroup.add(meshes.visualizer2.inner)
	visGroup.add(meshes.visualizer2.outer)
	visGroup.add(meshes.visualizer3.inner)
	visGroup.add(meshes.visualizer3.outer)
	visGroup.add(meshes.visualizer4.inner)
	visGroup.add(meshes.visualizer4.outer)

	meshes.visualizer1.inner.position.set(0, 2.25, -0.75)
	meshes.visualizer1.outer.position.set(0, 2.25, -0.75)
	meshes.visualizer2.inner.position.set(-2.25, 0.0, -0.75)
	meshes.visualizer2.outer.position.set(-2.25, 0.0, -0.75)
	meshes.visualizer3.inner.position.set(2.25, 0.0, -0.75)
	meshes.visualizer3.outer.position.set(2.25, 0.0, -0.75)
	meshes.visualizer4.inner.position.set(0.0, -2.25, -0.75)
	meshes.visualizer4.outer.position.set(0.0, -2.25, -0.75)
	// interactables.push(meshes.visualizer1.inner)
	interactables.push(meshes.visualizer1.outer)
	// interactables.push(meshes.visualizer2.inner)
	interactables.push(meshes.visualizer2.outer)
	// interactables.push(meshes.visualizer3.inner)
	interactables.push(meshes.visualizer3.outer)
	// interactables.push(meshes.visualizer4.inner)
	interactables.push(meshes.visualizer4.outer)

	meshes.glass.position.set(0, 0, -0.75)

	scene.environment = HDRI(loadManager, '/hdri5.hdr')
	//lights

	meshes.default.position.set(0, 0.2, 1.25)

	//scene operations
	scene.add(meshes.glass)
	scene.add(visGroup)
	// scene.add(meshes.visualizer1.inner)
	// scene.add(meshes.visualizer1.outer)
	// scene.add(meshes.visualizer2.inner)
	// scene.add(meshes.visualizer2.outer)
	// scene.add(meshes.visualizer3.inner)
	// scene.add(meshes.visualizer3.outer)
	// scene.add(meshes.visualizer4.inner)
	// scene.add(meshes.visualizer4.outer)

	setupPane()

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

			analyser.initAudio()
			analyser.swapSongs(intersects[0].object.userData.url)
			prev = active
			active = intersects[0].object.userData.num
			audioFlag = true
		} else {
			if (active !== intersects[0].object.userData.num) {
				analyser.swapSongs(intersects[0].object.userData.url)
				prev = active
				active = intersects[0].object.userData.num
			}
		}
	} else {
		stopAudio()
	}
}

function listeners() {
	window.addEventListener('mousemove', onMouseMove)
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
	window.addEventListener('keydown', (event) => {
		if (event.key === 'Escape') {
			stopAudio()
		}
	})
}

function animate() {
	requestAnimationFrame(animate)
	const eT = clock.getElapsedTime()

	if (audioFlag && analyser && active && meshes[`visualizer${active}`]) {
		try {
			const data = analyser.analyze()
			if (data) {
				const vis = meshes[`visualizer${active}`]

				// Update PARAMS
				PARAMS.frequency = data.frequency
				PARAMS.amplitude = data.amplitude
				PARAMS.low = data.lower
				PARAMS.mid = data.middle
				PARAMS.upper = data.upper

				vis.outer.rotation.x += 0.02
				vis.inner.rotation.z -= 0.01

				// Update inner material uniforms
				vis.inner.material.uniforms.uTime.value = eT
				vis.inner.material.uniforms.uFreq.value = PARAMS.frequency
				vis.inner.material.uniforms.uAmp.value = PARAMS.amplitude
				vis.inner.material.uniforms.uLowF.value = PARAMS.low
				vis.inner.material.uniforms.uMidF.value = PARAMS.mid
				vis.inner.material.uniforms.uHighF.value = PARAMS.upper

				// Update outer material uniforms
				vis.outer.material.uniforms.uTime.value = eT
				vis.outer.material.uniforms.uFreq.value = PARAMS.frequency
				vis.outer.material.uniforms.uAmp.value = PARAMS.amplitude
				vis.outer.material.uniforms.uLowF.value = PARAMS.low
				vis.outer.material.uniforms.uMidF.value = PARAMS.mid
				vis.outer.material.uniforms.uHighF.value = PARAMS.upper
			}
		} catch (error) {
			console.error('Error analyzing audio:', error)
		}
	}

	if (meshes.lotus) {
		meshes.lotus.rotation.y += 0.0025
	}
	if (meshes.glass) {
		meshes.glass.rotation.y -= 0.0025
	}
	if (!audioFlag) {
		visGroup.rotation.z -= 0.005
	}
	composer.composer.render()
}

function stopAudio() {
	if (analyser) {
		const { context, analyser: resetAnalyser } = analyser.stopAudio()

		// Reset visualization state
		audioFlag = false

		// Reset previous visualizer if it exists
		if (prev !== null) {
			const vis = meshes[`visualizer${prev}`]
			if (vis) {
				resetVisualizer(vis)
			}
		}

		// Reset current visualizer
		if (active !== null) {
			const vis = meshes[`visualizer${active}`]
			if (vis) {
				resetVisualizer(vis)
			}
		}

		// Reset active and prev states
		active = null
		prev = null
	}
}

// Helper function to reset visualizer uniforms
function resetVisualizer(vis) {
	const uniforms = ['uAmp', 'uFreq', 'uLowF', 'uMidF', 'uHighF']

	uniforms.forEach((uniform) => {
		vis.inner.material.uniforms[uniform].value = 0
		vis.outer.material.uniforms[uniform].value = 0
	})
}

function setupPane() {
	const pane = new Pane()
	const folder = pane.addFolder({ title: 'Audio Visualizer' })

	folder.addBinding(PARAMS, 'frequency', {
		min: 0.0,
		max: 100.0,
		label: 'Frequency',
	})
	folder.addBinding(PARAMS, 'amplitude', {
		min: 0.0,
		max: 100.0,
		label: 'Amplitude',
	})
	folder.addBinding(PARAMS, 'low', {
		min: 0.0,
		max: 10.0,
		label: 'Low Freq',
	})
	folder.addBinding(PARAMS, 'mid', {
		min: 0.0,
		max: 10.0,
		label: 'Mid Freq',
	})
	folder.addBinding(PARAMS, 'upper', {
		min: 0.0,
		max: 10.0,
		label: 'High Freq',
	})

	return pane
}
