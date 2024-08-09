// import './style.css'
import * as THREE from 'three'
import { addBoilerPlateMesh, addStandardMesh } from './addMeshes'
import { addLight, addAmbient } from './addLights'
import Model from './Model'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { HDRI } from './environment'
import { manager } from './manager'
import { ragingSeas } from './ragingSeas'
import { postprocessing } from './postprocessing'
import Portal from './portal'
import { addMoon } from './addMoon'
import { createParticles } from './addParticle'

const scene = new THREE.Scene()
const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.toneMapping = THREE.ReinhardToneMapping
renderer.toneMappingExposure = 4.5
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
const camera = new THREE.PerspectiveCamera(
	75,
	window.innerWidth / window.innerHeight,
	0.1,
	100
)
camera.position.set(0, 0.2, 3)

//Globals
const meshes = {}
const lights = {}
const mixers = []
const clock = new THREE.Clock()
const composer = postprocessing(scene, camera, renderer)
const interactables = []
let loadedFlag = false
const loadManager = manager(() => {
	loadedFlag = true
}, camera)
// const loadManager = manager(null, camera)
const raycaster = new THREE.Raycaster()
const mouse = new THREE.Vector2()
const defaultVector = new THREE.Vector2(0.5, 0.5)
let targetMouse = new THREE.Vector2()
let currentMouse = new THREE.Vector2(0.5, 0.5)

init()
function init() {
	renderer.setSize(window.innerWidth, window.innerHeight)
	document.body.appendChild(renderer.domElement)

	//meshes
	meshes.default = addBoilerPlateMesh()
	meshes.water = ragingSeas()
	meshes.portal = Portal(interactables)
	meshes.moon = addMoon({ position: [0, 1.75, -4.5] })
	meshes.particles = createParticles(5000, 0.05, camera)
	// meshes.particles.position.set(0, 2, -10)
	scene.add(meshes.particles)

	scene.environment = HDRI(loadManager)
	//lights

	//changes
	// meshes.default.scale.set(2, 2, 2)
	meshes.default.position.set(0, 0.2, 1.25)

	//scene operations
	scene.add(meshes.water)
	scene.add(meshes.portal)
	scene.add(meshes.moon)

	window.addEventListener('mousemove', onMouseMove)
	instances()
	resize()
	animate()
}

function onMouseMove(event) {
	// targetMouse.x = event.clientX / window.innerWidth
	// targetMouse.y = 1.0 - event.clientY / window.innerHeight // Keep Y inverted for Three.js
	targetMouse.x = (event.clientX / window.innerWidth) * 2 - 1
	targetMouse.y = -(event.clientY / window.innerHeight) * 2 + 1
}

function instances() {
	const gate2 = new Model({
		name: 'gate2',
		meshes: meshes,
		scene: scene,
		url: '/gate2/test2.glb',
		scale: new THREE.Vector3(1.5, 1.5, 1.5),
		position: new THREE.Vector3(0, 0.1, 0.6),
		manager: loadManager,
	})
	gate2.init()
}

function resize() {
	window.addEventListener('resize', () => {
		renderer.setSize(window.innerWidth, window.innerHeight)
		camera.aspect = window.innerWidth / window.innerHeight
		camera.updateProjectionMatrix()
	})
}

function animate() {
	requestAnimationFrame(animate)
	const eT = clock.getElapsedTime()
	meshes.water.material.uniforms.uTime.value = eT
	meshes.portal.material.uniforms.uTime.value = eT
	// meshes.particles.material.uniforms.uTime.value = eT

	if (loadedFlag && interactables.length > 0) {
		raycaster.setFromCamera(mouse, camera)
		const intersects = raycaster.intersectObject(interactables[0])
		if (intersects.length > 0) {
			currentMouse.x += (targetMouse.x - currentMouse.x) * 0.05
			currentMouse.y += (targetMouse.y - currentMouse.y) * 0.05
			meshes.portal.material.uniforms.uMouse.value.set(
				currentMouse.x,
				currentMouse.y
			)
		} else {
			meshes.portal.material.uniforms.uMouse.value = defaultVector
		}
	}
	meshes.moon.rotation.x += 0.001
	meshes.moon.rotation.y -= 0.001

	composer.composer.render()
}
