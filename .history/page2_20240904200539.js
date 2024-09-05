// import './style.css'
import * as THREE from 'three'
import { addBoilerPlateMesh, addStandardMesh } from './addMeshes'
import { addLight, addAmbient } from './addLights'
import Model from './Model'
import { HDRI } from './environment'
import { manager } from './manager'
import gsap from 'gsap'
import { OrbitControls } from 'three/examples/jsm/Addons.js'
import { postprocessing } from './postprocessing'
import { addGlass } from './addGlass'

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
camera.position.set(0, 0.2, 15)

//Globals
const meshes = {}
const lights = {}
const mixers = []
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
let currentMouse = new THREE.Vector2(0.5, 0.5)
const mouseVector = new THREE.Vector3(0, 0, 0.5)
const composer = postprocessing(scene, camera, renderer)

init()
function init() {
	renderer.setSize(window.innerWidth, window.innerHeight)
	document.body.appendChild(renderer.domElement)

	//meshes
	meshes.default = addBoilerPlateMesh()
	meshes.glass = addGlass()

	meshes.glass.position.set(0, 0, -0.75)

	scene.environment = HDRI(loadManager)
	//lights

	//changes

	meshes.default.position.set(0, 0.2, 1.25)

	//scene operations
	scene.add(meshes.glass)

	instances()
	setupPost()
	resize()
	animate()
}

function setupPost() {
	composer.bloom.strength = 0.7
	composer.bloom.threshold = 0.1
	composer.bloom.radius = 0.5
}

function onMouseMove(event) {
	targetMouse.x = (event.clientX / window.innerWidth) * 2 - 1
	targetMouse.y = -(event.clientY / window.innerHeight) * 2 + 1
	mouse.x = (event.clientX / window.innerWidth) * 2 - 1
	mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
	mouseVector.set(mouse.x, mouse.y, 0.5).unproject(camera)
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
		position: new THREE.Vector3(0, 0.0, -0.0),
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

function animate() {
	requestAnimationFrame(animate)
	const eT = clock.getElapsedTime()

	if (meshes.lotus) {
		// meshes.lotus.rotation.y += 0.0025
	}
	if (meshes.glass) {
		// meshes.glass.rotation.y -= 0.0025
	}
	composer.composer.render()
	// renderer.render(scene, camera)
}
