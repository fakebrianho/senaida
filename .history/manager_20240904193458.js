import { LoadingManager } from 'three'
import gsap from 'gsap'

export function manager(callback, camera, page = 1) {
	const loadManager = new LoadingManager()
	loadManager.onLoad = function () {
		gsap.to(camera.position, {
			z: 1.25,
			duration: 4,
		})
		gsap.to('.loader', {
			autoAlpha: 0,
			duration: 4,
			onComplete: () => {
				document.querySelector('.loader').style.display = 'none'
				gsap.to('.comingSoon', {
					opacity: 1,
					duration: 1,
				})
			},
		})
		if (callback) callback()
	}
	return loadManager
}
