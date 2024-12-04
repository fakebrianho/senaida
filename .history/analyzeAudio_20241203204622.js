import * as Tone from 'tone'
// These are module-level variables, shared across all instances
let context = null
let source = null

export function analyzeAudio(url) {
	let analyser
	let dataArray
	let bufferTime
	let audio
	// Add Tone.js effects
	let tonePlayer
	let reverb
	let delay
	let filter

	function initAudio() {
		audio = document.getElementById('audio')

		// Initialize Tone.js
		Tone.start()

		// Create Tone.js effects
		reverb = new Tone.Reverb({
			decay: 2.5,
			wet: 0.2,
		}).toDestination()

		delay = new Tone.FeedbackDelay({
			delayTime: 0.25,
			feedback: 0.3,
			wet: 0.2,
		}).connect(reverb)

		filter = new Tone.Filter({
			type: 'lowpass',
			frequency: 1000,
			Q: 1,
		}).connect(delay)

		// Create Tone.js player
		tonePlayer = new Tone.Player().connect(filter)

		// Initialize Web Audio API context through Tone.js
		if (!context) {
			context = Tone.getContext()
			source = context.createMediaElementSource(audio)
		}

		// Create analyzer node
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
		if (tonePlayer) {
			tonePlayer.stop()
		}
		if (analyser) {
			analyser.disconnect()
			analyser = null
		}
		return { context, analyser }
	}

	function swapSongs(_url) {
		const audioUrl = `/audio/${_url}`
		// Load audio into Tone.js player
		tonePlayer.load(audioUrl).then(() => {
			tonePlayer.start()
		})
	}

	// Add effect control functions
	function setReverbDecay(value) {
		reverb.decay = value
	}

	function setDelayTime(value) {
		delay.delayTime.value = value
	}

	function setFilterFrequency(value) {
		filter.frequency.value = value
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
		// Add new effect control methods
		setReverbDecay,
		setDelayTime,
		setFilterFrequency,
	}
}
