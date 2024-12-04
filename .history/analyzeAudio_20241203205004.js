import * as Tone from 'tone'

let context = null
let source = null

export function analyzeAudio(url) {
	let analyser
	let dataArray
	let bufferTime
	let audio
	let tonePlayer
	let reverb
	let delay
	let filter

	async function startAudioContext() {
		try {
			await Tone.start()
			console.log('Audio context started')
			return true
		} catch (error) {
			console.error('Failed to start audio context:', error)
			return false
		}
	}

	function initAudio() {
		console.log('running')
		audio = document.getElementById('audio')
		if (!audio) {
			audio = document.createElement('audio')
			audio.id = 'audio'
			document.body.appendChild(audio)
		}

		if (!context) {
			context = new (window.AudioContext || window.webkitAudioContext)()
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

	function swapSongs(_url) {
		const audioUrl = `/audio/${_url}`
		audio.src = audioUrl
		audio.play()
	}

	function stopAudio() {
		console.log('stopping')
		if (audio) {
			audio.pause()
			audio.currentTime = 0
		}
		if (analyser) {
			analyser.disconnect()
			analyser = null
		}
		return { context, analyser }
	}

	// Rest of your existing analysis functions
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
			} else if (500 < freqToHerz <= 2000) {
				middle = mapper(dataArray[i], 0, 256, 0, 1.0)
			} else if (2000 < freqToHerz <= 10000) {
				upper = mapper(dataArray[i], 0, 256, 0, 1.0)
			}
		}
		let averageAmplitude = getRMS(bufferTime)
		let averageFreq = getAverageFrequency(dataArray)

		return {
			amplitude: averageAmplitude,
			frequency: averageFreq,
			lower: lower,
			middle: middle,
			upper: upper,
		}
	}

	return {
		analyze,
		initAudio,
		swapSongs,
		stopAudio,
		startAudioContext,
	}
}
