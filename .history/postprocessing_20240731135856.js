import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'
import { Vector2 } from 'three'

export function postprocessing(scene, camera, renderer) {
	const composer = new EffectComposer(renderer)
	composer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
	composer.setSize(window.innerWidth, window.innerHeight)

	const renderPass = new RenderPass(scene, camera)
	composer.addPass(renderPass)

	const bloomPass = new UnrealBloomPass()
	bloomPass.strength = 0.3
	bloomPass.radius = 1.5
	bloomPass.threshold = 0.1
	composer.addPass(bloomPass)

	return { composer: composer, bloom: bloomPass }
}
