import { LoadingManager } from 'three'

export function manager(callback) {
	const loadManager = new LoadingManager()
	loadManager.onLoad = function () {
		gsap.to('.loader', {
			opacity: 0,
			duration: 4,
		})
		callback()
	}
	return loadManager
}
