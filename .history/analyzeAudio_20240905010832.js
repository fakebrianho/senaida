export function analyzeAudio() {
	let context
	let analyser
	let dataArray
	let bufferTime
	let canvas
	// var file = document.getElementById('thefile')
	var audio = document.getElementById('audio')
	// var fileLabel = document.querySelector('label.file')
	// audio.classList.add('active')
	audio.src = '/audio/jz.mp3'
	audio.load()
	audio.play()
	initAudio()
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
	function initAudio() {
		console.log('looggin')
		context = new AudioContext()
		var src = context.createMediaElementSource(audio)
		analyser = context.createAnalyser()
		src.connect(analyser)
		analyser.connect(context.destination)
		analyser.fftSize = 512
		var bufferLength = analyser.frequencyBinCount
		dataArray = new Uint8Array(bufferLength)
		bufferTime = new Uint8Array(bufferLength)
		analyser.getByteTimeDomainData(bufferTime)
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
	}
}
