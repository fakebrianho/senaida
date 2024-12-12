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
const btn = document.querySelector('.play')
btn.addEventListener('click', () => {
	gsap.to('.autoplay', {
		opacity: 0,
		duration: 1.5,
		onComplete: () => {
			document.querySelector('.autoplay').style.display = 'none'
		},
	})
	const introTimeline = gsap.timeline()
	introTimeline
		.to('.intro', { opacity: 1, duration: 3.5 })
		.to('.intro', { opacity: 0, duration: 2 }, '+=3')
})

const back = document.querySelector('.round')
const arrow = document.querySelector('.arrow')
back.addEventListener('click', (e) => {
	e.stopPropagation()
	e.preventDefault()
	selectFlag = false

	// Reset all visualizers to their original positions
	for (let i = 1; i <= 4; i++) {
		const vis = meshes[`visualizer${i}`]
		if (vis) {
			const origPos = originalPositions[`visualizer${i}`]
			gsap.to(vis.inner.position, {
				x: origPos.x,
				y: origPos.y,
				z: origPos.z,
				duration: 1,
			})
			gsap.to(vis.outer.position, {
				x: origPos.x,
				y: origPos.y,
				z: origPos.z,
				duration: 1,
			})

			// Reset material colors
			if (i === selected) {
				const material = vis.outer.material
				gsap.to(material.color, {
					r: 1,
					g: 1,
					b: 1,
					duration: 1,
				})
				gsap.to(material.emissive, {
					r: 0,
					g: 0,
					b: 0,
					duration: 1,
				})
				material.opacity = 1
				material.needsUpdate = true
			}
		}
	}

	gsap.to('.center-con', {
		opacity: 0,
		duration: 1.5,
		ease: 'power1.inOut',
	})
	gsap.to('#tweakpane-container', {
		opacity: 0,
		duration: 1,
	})
})

const scene = new THREE.Scene()
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
renderer.physicallyCorrectLights = true
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
let clickedMode = false
let selected = null
const loadManager = manager(
	() => {
		loadedFlag = true
	},
	camera,
	2
)
const raycaster = new THREE.Raycaster()
const mouse = new THREE.Vector2()
// const controls = new OrbitControls(camera, renderer.domElement)
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

// Store original positions at the top with other globals
const originalPositions = {
	visualizer1: { x: 0, y: 2.25, z: -0.75 },
	visualizer2: { x: -2.25, y: 0.0, z: -0.75 },
	visualizer3: { x: 2.25, y: 0.0, z: -0.75 },
	visualizer4: { x: 0.0, y: -2.25, z: -0.75 },
}

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
		1,
		'Disconnected'
	)
	meshes.visualizer2 = addVisualizer(
		'FRAGILE_original_demo',
		'FRAGILE_remixe_noise',
		2,
		'Fragile'
	)
	meshes.visualizer3 = addVisualizer(
		'JUDGEMENT_original_demo',
		'JUDGEMENT_remix_noise',
		3,
		'Judgement'
	)
	meshes.visualizer4 = addVisualizer(
		'MIMESIS_original_demo',
		'MIMESIS_remix_noise',
		4,
		'Mimesis'
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
	composer.bloom.strength = 0.1
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
		scale: new THREE.Vector3(0.22, 0.22, 0.22),
		position: new THREE.Vector3(0, -0.25, -0.7),
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
	const mouseText = document.querySelector('.mouse-text')
	mouseText.style.left = event.clientX + 'px'
	mouseText.style.top = event.clientY + 20 + 'px' // 20px offset from cursor

	if (!selectFlag) {
		if (intersects.length > 0) {
			document.body.style.cursor = 'pointer'
			gsap.to(composer.bloom, {
				strength: 0.8,
				duration: 0.2,
				ease: 'power1.inOut',
			})

			if (!audioFlag) {
				analyser = analyzeAudio()
				analyser.initAudio()
				if (PARAMS.LoFi) {
					analyser.swapSongs(intersects[0].object.userData.lf)
				} else {
					analyser.swapSongs(intersects[0].object.userData.url)
				}
				mouseText.innerHTML = intersects[0].object.userData.name
				mouseText.style.opacity = '1'
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
			document.body.style.cursor = 'default'
			gsap.to(composer.bloom, {
				strength: 0.1,
				duration: 0.1,
				ease: 'power1.inOut',
			})
			mouseText.innerHTML = ''
			mouseText.style.opacity = '0'

			stopAudio()
		}
	}
}

function onClick(event) {
	mouse.x = (event.clientX / window.innerWidth) * 2 - 1
	mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
	raycaster.setFromCamera(mouse, camera)
	const intersects = raycaster.intersectObjects(interactables)

	if (intersects.length > 0) {
		const clickedNum = intersects[0].object.userData.num

		// Move all visualizers except the clicked one off screen
		for (let i = 1; i <= 4; i++) {
			if (i !== clickedNum) {
				const vis = meshes[`visualizer${i}`]
				if (vis) {
					// Move off screen instead of removing
					gsap.to(vis.inner.position, {
						x: i < clickedNum ? -10 : 10, // Move left or right based on position
						y: vis.inner.position.y,
						z: -0.75,
						duration: 1,
					})
					gsap.to(vis.outer.position, {
						x: i < clickedNum ? -10 : 10,
						y: vis.outer.position.y,
						z: -0.75,
						duration: 1,
					})
				}
			}
		}

		gsap.to('.center-con', {
			opacity: 1,
			duration: 1.5,
			ease: 'power1.inOut',
		})
		selectFlag = true
		selected = clickedNum

		gsap.to('#tweakpane-container', {
			opacity: 1,
			duration: 1,
		})

		// Animate the selected visualizer to center
		gsap.to(meshes[`visualizer${clickedNum}`].inner.position, {
			x: 0,
			y: 0,
			z: 1.2,
			duration: 1,
		})
		gsap.to(meshes[`visualizer${clickedNum}`].outer.position, {
			x: 0,
			y: 0,
			z: 1.2,
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
	meshes.visualizer1.outer.rotation.x += 0.007
	meshes.visualizer1.outer.rotation.z += 0.004
	meshes.visualizer2.outer.rotation.y += 0.007
	meshes.visualizer2.outer.rotation.x -= 0.003
	meshes.visualizer3.outer.rotation.y -= 0.007
	meshes.visualizer3.outer.rotation.x -= 0.002
	meshes.visualizer4.outer.rotation.z -= 0.007
	meshes.visualizer4.outer.rotation.x += 0.003

	if (audioFlag && analyser && active && meshes[`visualizer${active}`]) {
		try {
			const data = analyser.analyze()
			if (data) {
				const vis = meshes[`visualizer${active}`]

				vis.outer.rotation.x += 0.02
				vis.inner.rotation.z -= 0.01

				vis.inner.material.uniforms.uTime.value = eT
				vis.inner.material.uniforms.uFreq.value =
					data.frequency * PARAMS.frequency * 0.5
				vis.inner.material.uniforms.uAmp.value =
					data.frequency * PARAMS.amplitude * 0.5
				const mappedFreq = THREE.MathUtils.mapLinear(
					data.frequency,
					0, // min input value
					255, // max input value (assuming your frequency data is 0-255)
					0, // min output value
					0.8 // max output value
				)
				vis.outer.material.displacementScale = mappedFreq
			}
		} catch (error) {
			console.error('Error analyzing audio:', error)
		}
	}
	if (selectFlag) {
		const material = meshes[`visualizer${selected}`].outer.material
		const targetColor = new THREE.Color()
		const targetEmissive = new THREE.Color()

		if (PARAMS.LoFi) {
			targetColor.setRGB(1, 0, 0.8) // Light pink
			targetEmissive.setRGB(1, 0, 0)
		} else {
			targetColor.setRGB(1, 0.45, 0.4) // Light gold
			targetEmissive.setRGB(1, 215 / 255, 0)
		}

		// Using GSAP for smooth color transition
		gsap.to(material.color, {
			r: targetColor.r,
			g: targetColor.g,
			b: targetColor.b,
			duration: 1,
			ease: 'power2.out',
		})

		gsap.to(material.emissive, {
			r: targetEmissive.r,
			g: targetEmissive.g,
			b: targetEmissive.b,
			duration: 2,
			ease: 'power2.out',
		})

		material.transparent = true
		material.needsUpdate = true
		material.emissiveIntensity = 0.2 // Adjust value between 0 and 1
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
		vis.outer.material.displacementScale = 0
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
