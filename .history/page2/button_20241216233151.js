import gsap from 'gsap'
export const setupButtons = () => {
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
			.to('.intro', { opacity: 1, duration: 1.5 })
			.to('.intro', { opacity: 0, duration: 1 }, '+=2')
	})
}
