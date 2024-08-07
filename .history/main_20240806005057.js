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

const scene = new THREE.Scene()
const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.toneMapping = THREE.ReinhardToneMapping
renderer.toneMappingExposure = 4.5
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
const camera = new THREE.PerspectiveCamera(
	75,
	window.innerWidth / window.innerHeight,
	0.01,
	10000
)
camera.position.set(0, 0.2, 3)

//Globals
const meshes = {}
const lights = {}
const mixers = []
const clock = new THREE.Clock()
const composer = postprocessing(scene, camera, renderer)
// const controls = new OrbitControls(camera, renderer.domElement)
const loadManager = manager(null, camera)

init()
function init() {
	renderer.setSize(window.innerWidth, window.innerHeight)
	document.body.appendChild(renderer.domElement)

	//meshes
	meshes.default = addBoilerPlateMesh()
	meshes.water = ragingSeas()
	meshes.portal = Portal()
	meshes.moon = addMoon({ position: [0, 1.75, -4.5] })
	// meshes.standard = addStandardMesh()
	// const loadManager = manager(setupConfigure)

	// scene.background = HDRI(loadManager)
	scene.environment = HDRI(loadManager)
	//lights
	// lights.defaultLight = addLight()
	// lights.ambientLight = addAmbient()

	//changes
	meshes.default.scale.set(2, 2, 2)

	//scene operations
	scene.add(meshes.water)
	scene.add(meshes.portal)
	scene.add(meshes.moon)
	// scene.add(meshes.default)
	// scene.add(meshes.standard)
	// scene.add(lights.defaultLight)
	// scene.add(lights.ambientLight)

	instances()
	resize()
	animate()
}

function instances() {
	const gate = new Model({
		name: 'gate',
		meshes: meshes,
		scene: scene,
		url: '/gate/arch.glb',
		scale: new THREE.Vector3(80, 80, 80),
		position: new THREE.Vector3(0, 0, 0),
	})
	// gate.obsidianMaterial()
	// gate.init()
	const gate2 = new Model({
		name: 'gate2',
		meshes: meshes,
		scene: scene,
		url: '/gate2/test2.glb',
		scale: new THREE.Vector3(1.5, 1.5, 1.5),
		position: new THREE.Vector3(0, 0.1, 0.6),
		manager: loadManager,
		// rotation: new THREE.Vector3(0, Math.PI / 2, 0),
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
	const delta = clock.getDelta()
	const eT = clock.getElapsedTime()
	// waterMaterial.uniforms.uTime.value = elapsedTime
	meshes.water.material.uniforms.uTime.value = eT
	meshes.portal.material.uniforms.uTime.value = eT

	meshes.moon.rotation.x += 0.001
	meshes.moon.rotation.y -= 0.001

	// console.log(scene.children)
	// if (scene.children.length > 4) {
	// scene.children[4].scale.set(80, 80, 80)
	// }

	// meshes.default.rotation.x += 0.01
	// meshes.default.rotation.z += 0.01

	// meshes.standard.rotation.x += 0.01
	// meshes.standard.rotation.z += 0.01

	// meshes.default.scale.x += 0.01

	// renderer.render(scene, camera)
	composer.composer.render()
}
