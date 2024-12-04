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
import gsap from 'gsap'

//play button

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
let selectFlag = false
const PARAMS = {
	frequency: 1.0,
	amplitude: 1.0,
	LoFi: false,
}

const composer = postprocessing(scene, camera, renderer)

init()
function init() {
	renderer.setSize(window.innerWidth, window.innerHeight)
	document.body.appendChild(renderer.domElement)

	//meshes
	meshes.default = addBoilerPlateMesh()
	meshes.glass = addGlass()
	meshes.visualizer1 = addVisualizer(
		'DISCONNECTED_original_demo',
		'DISCONNECTED_remix_noise',
		1
	)
	meshes.visualizer2 = addVisualizer(
		'FRAGILE_original_demo',
		'FRAGILE_remixe_noise',
		2
	)
	meshes.visualizer3 = addVisualizer(
		'JUDGEMENT_original_demo',
		'JUDGEMENT_remix_noise',
		3
	)
	meshes.visualizer4 = addVisualizer(
		'MIMESIS_original_demo',
		'MIMESIS_remix_noise',
		4
	)

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
			if (PARAMS.LoFi) {
				analyser.swapSongs(intersects[0].object.userData.lf)
			} else {
				analyser.swapSongs(intersects[0].object.userData.url)
			}
			prev = active
			active = intersects[0].object.userData.num
			audioFlag = true
		} else {
			if (active !== intersects[0].object.userData.num) {
				if (PARAMS.LoFi) {
					analyser.swapSongs(intersects[0].object.userData.lf)
				} else {
					analyser.swapSongs(intersects[0].object.userData.url)
				}
				prev = active
				active = intersects[0].object.userData.num
			}
		}
	} else {
		stopAudio()
	}
}

function onClick(event) {
	mouse.x = (event.clientX / window.innerWidth) * 2 - 1
	mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
	raycaster.setFromCamera(mouse, camera)
	const intersects = raycaster.intersectObjects(interactables)

	if (intersects.length > 0) {
		const clickedNum = intersects[0].object.userData.num

		// Remove all visualizers except the clicked one
		for (let i = 1; i <= 4; i++) {
			if (i !== clickedNum) {
				const vis = meshes[`visualizer${i}`]
				if (vis) {
					// Dispose materials and geometries
					vis.inner.geometry.dispose()
					vis.outer.geometry.dispose()
					vis.inner.material.dispose()
					vis.outer.material.dispose()

					// Remove from visGroup
					visGroup.remove(vis.inner)
					visGroup.remove(vis.outer)

					// Remove from interactables array
					const outerIndex = interactables.indexOf(vis.outer)
					if (outerIndex > -1) {
						interactables.splice(outerIndex, 1)
					}
				}
			}
		}
		gsap.to('#tweakpane-container', {
			opacity: 1,
			duration: 1,
		})

		// Animate the remaining visualizer to center
		gsap.to(meshes[`visualizer${clickedNum}`].inner.position, {
			x: 0,
			y: 0,
			z: 0,
			duration: 1,
		})
		gsap.to(meshes[`visualizer${clickedNum}`].outer.position, {
			x: 0,
			y: 0,
			z: 0,
			duration: 1,
		})
	}
}

function listeners() {
	window.addEventListener('mousemove', onMouseMove)
	window.addEventListener('click', onClick)
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

	if (audioFlag && analyser && active && meshes[`visualizer${active}`]) {
		try {
			const data = analyser.analyze()
			if (data) {
				const vis = meshes[`visualizer${active}`]

				vis.outer.rotation.x += 0.02
				vis.inner.rotation.z -= 0.01

				vis.inner.material.uniforms.uTime.value = eT
				vis.outer.material.uniforms.uTime.value = eT
				vis.inner.material.uniforms.uFreq.value =
					data.frequency * PARAMS.frequency * 0.25
				vis.inner.material.uniforms.uAmp.value =
					data.frequency * PARAMS.amplitude * 0.25
				vis.outer.material.uniforms.uFreq.value =
					data.frequency * PARAMS.frequency * 0.25
				vis.outer.material.uniforms.uAmp.value =
					data.frequency * PARAMS.amplitude * 0.25
				if (selectFlag) {
					vis.outer.material.uniforms.uColor1 = new THREE.Color(
						0xfcba03
					)
				}
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
	// Create a container div with an ID
	const container = document.createElement('div')
	container.id = 'tweakpane-container'
	document.body.appendChild(container)

	const pane = new Pane({
		container: container,
	})

	// Style the container
	pane.element.style.position = 'fixed'
	pane.element.style.bottom = '50px'
	pane.element.style.left = '50%'
	pane.element.style.transform = 'translateX(-50%)'

	const folder = pane.addFolder({ title: 'Audio Visualizer' })

	folder.addBinding(PARAMS, 'LoFi', {
		label: 'LoFi',
	})

	folder.addBinding(PARAMS, 'frequency', {
		min: 1.0,
		max: 5.0,
		label: 'Frequency',
	})
	folder.addBinding(PARAMS, 'amplitude', {
		min: 1.0,
		max: 5.0,
		label: 'Amplitude',
	})

	return pane
}
