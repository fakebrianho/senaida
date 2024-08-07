import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'
import { Vector2 } from 'three'
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass'

export function postprocessing(scene, camera, renderer) {
	const composer = new EffectComposer(renderer)
	composer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
	composer.setSize(window.innerWidth, window.innerHeight)

	const renderPass = new RenderPass(scene, camera)
	composer.addPass(renderPass)

	const bloomPass = new UnrealBloomPass()
	bloomPass.strength = 4.5
	bloomPass.radius = 0.04
	bloomPass.threshold = 0.01
	composer.addPass(bloomPass)

	// const outputPass = new OutputPass()
	// composer.addPass(outputPass)

	return { composer: composer, bloom: bloomPass }
}
