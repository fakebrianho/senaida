import { Pane } from 'tweakpane'
import gsap from 'gsap'

export const tweak = (PARAMS) => {
	let isGenerating = false

	const container = document.createElement('div')
	container.id = 'tweakpane-container'
	document.body.appendChild(container)

	const pane = new Pane({
		container: container,
	})

	pane.element.style.position = 'fixed'
	pane.element.style.bottom = '50px'
	pane.element.style.left = '50%'
	pane.element.style.transform = 'translateX(-50%)'

	const folder = pane.addFolder({ title: 'Generation Parameters' })

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

	folder.addBinding(PARAMS, 'Seeding', {
		label: 'Seeding',
		min: 0,
		max: 10,
		step: 0.1,
		format: (v) => v.toFixed(1),
	})

	const energyFolder = folder.addFolder({
		title: 'Energy Controls',
		expanded: true,
	})

	energyFolder.addBinding(PARAMS, 'lowEnergy', {
		label: 'Low Energy',
		min: 0,
		max: 5.0,
		step: 0.1,
		format: (v) => v.toFixed(1),
	})

	energyFolder.addBinding(PARAMS, 'midEnergy', {
		label: 'Mid Energy',
		min: 0,
		max: 5.0,
		step: 0.1,
		format: (v) => v.toFixed(1),
	})

	energyFolder.addBinding(PARAMS, 'highEnergy', {
		label: 'High Energy',
		min: 0,
		max: 5.0,
		step: 0.1,
		format: (v) => v.toFixed(1),
	})

	const btn = folder.addButton({
		title: 'Generate',
		label: 'Generate',
	})

	btn.on('click', () => {
		const audio = document.getElementById('audio')

		const startGeneration = () => {
			gsap.to(composer.bloom, {
				strength: 0.1,
				duration: 1,
			})
			const controlsToRemove = [...folder.children]
			controlsToRemove.forEach((control) => {
				if (control !== btn) {
					folder.remove(control)
				}
			})
			btn.title = 'Generating'
			btn.label = 'Generating'
			gsap.to(audio, {
				volume: 0,
				duration: 2,
				ease: 'power2.inOut',
				onComplete: () => {
					audio.pause()

					if (selected && meshes[`visualizer${selected}`]) {
						const material =
							meshes[`visualizer${selected}`].outer.material
						const colorTimeline = gsap.timeline()

						const colors = [
							{ r: 1, g: 0, b: 0 },
							{ r: 0, g: 0, b: 1 },
							{ r: 1, g: 0, b: 1 },
							{ r: 0, g: 1, b: 0 },
							{ r: 1, g: 0.45, b: 0.4 },
						]

						colors.forEach((color, index) => {
							colorTimeline.to(material.color, {
								r: color.r,
								g: color.g,
								b: color.b,
								duration: 0.3,
								ease: 'power2.inOut',
							})

							colorTimeline.to(
								material.emissive,
								{
									r: color.r * 0.5,
									g: color.g * 0.5,
									b: color.b * 0.5,
									duration: 0.3,
									ease: 'power2.inOut',
								},
								`-=0.2`
							)
						})

						colorTimeline.add(() => {
							console.log(analyser)
							analyser.swapSongs(getRandomRemixUrl(selected))
							const audio = document.getElementById('audio')
							audio.volume = 1
							gsap.to(audio, {
								volume: 1,
								duration: 2,
								ease: 'power2.inOut',
							})
							colorTimeline.kill()
							btn.title = 'Generate Again'
							btn.label = 'Generate Again'
							isGenerating = true
						}, '+=0.2')

						colorTimeline.play()
					}
				},
			})
		}

		if (!isGenerating) {
			startGeneration()
		} else {
			startGeneration()
		}
	})

	return pane
}
