import { LoadingManager } from 'three'
import gsap from 'gsap'

export function manager(callback, camera) {
	const loadManager = new LoadingManager()
	loadManager.onLoad = function () {
		// gsap.to()
		gsap.to('.loader', {
			autoAlpha: 0,
			duration: 4,
			onComplete: () => {
				document.querySelector('.loader').style.display = 'none'
			},
		})
		if (callback) callback()
	}
	return loadManager
}
