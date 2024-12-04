// These are module-level variables, shared across all instances
let context = null
let source = null

export function analyzeAudio(url) {
	let analyser
	let dataArray
	let bufferTime
	let audio

	function initAudio() {
		console.log('running')
		audio = document.getElementById('audio')

		// Reuse existing context if we have one
		if (!context) {
			context = new AudioContext()
			source = context.createMediaElementSource(audio)
		}

		// Create new analyser node
		analyser = context.createAnalyser()
		source.connect(analyser)
		analyser.connect(context.destination)
		analyser.fftSize = 512

		const bufferLength = analyser.frequencyBinCount
		dataArray = new Uint8Array(bufferLength)
		bufferTime = new Uint8Array(bufferLength)
		analyser.getByteTimeDomainData(bufferTime)
	}

	function stopAudio() {
		console.log('stopping')
		audio = document.getElementById('audio')

		// Only disconnect the analyser, keep the source connected
		if (analyser) {
			analyser.disconnect()
			analyser = null
		}

		return { context, analyser }
	}

	function swapSongs(_url) {
		audio = document.getElementById('audio')
		// var fileLabel = document.querySelector('label.file')
		// audio.classList.add('active')
		audio.src = `/audio/${_url}`
		audio.load()
		audio.play()
	}
	function getAverageFrequency(dataArray) {
		let value = 0
		const data = dataArray

		for (let i = 0; i < data.length; i++) {
			value += data[i]
		}

		return value / data.length
	}

	function getRMS(bufferTime) {
		let bTime = bufferTime
		var rms = 0
		for (let i = 0; i < bTime.length; i++) {
			rms += bTime[i] * bTime[i]
		}
		rms /= bTime.length
		rms = Math.sqrt(rms)
		return rms
	}

	function mapper(value, x1, y1, x2, y2) {
		return ((value - x1) * (y2 - x2)) / (y1 - x1) + x2
	}
	function analyze() {
		analyser.getByteFrequencyData(dataArray)
		analyser.getByteTimeDomainData(bufferTime)
		let lower
		let middle
		let upper
		for (let i = 0; i < dataArray.length; i++) {
			let freqToHerz = i * (48000 / 512)
			if (freqToHerz <= 500) {
				lower = mapper(dataArray[i], 0, 256, 0, 1.0)
				// innerMaterial.uniforms.uLowF.value = lower
			} else if (500 < freqToHerz <= 2000) {
				middle = mapper(dataArray[i], 0, 256, 0, 1.0)
				// innerMaterial.uniforms.uMidF.value = middle
			} else if (2000 < freqToHerz <= 10000) {
				upper = mapper(dataArray[i], 0, 256, 0, 1.0)
				// innerMaterial.uniforms.uHighF.value = upper
			}
		}
		let averageAmplitude = getRMS(bufferTime)
		let averageFreq = getAverageFrequency(dataArray)
		// return [averageAmplitude, averageFreq, lower, middle, upper]
		return {
			amplitude: averageAmplitude,
			frequency: averageFreq,
			lower: lower,
			middle: middle,
			upper: upper,
		}
	}
	return {
		analyze: analyze,
		initAudio: initAudio,
		swapSongs: swapSongs,
		stopAudio: stopAudio,
	}
}
