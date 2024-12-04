// These are module-level variables, shared across all instances
let context = null
let source = null

export function analyzeAudio(url) {
	let analyser
	let dataArray
	let bufferTime
	let audio

	function initAudio() {
		audio = document.getElementById('audio')
		if (!audio) {
			// Create audio element if it doesn't exist
			audio = document.createElement('audio')
			audio.id = 'audio'
			// Add support for multiple formats
			audio.setAttribute('type', 'audio/*')
			document.body.appendChild(audio)
		}

		// Reuse existing context if we have one
		if (!context) {
			context = new (window.AudioContext || window.webkitAudioContext)()
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
		audio = document.getElementById('audio')

		// Only disconnect the analyser, keep the source connected
		if (analyser) {
			analyser.disconnect()
			analyser = null
		}

		return { context, analyser }
	}

	function swapSongs(_url) {
		return new Promise((resolve, reject) => {
			audio = document.getElementById('audio')
			audio.onerror = (e) => {
				console.error('Error loading audio:', e)
				reject(e)
			}
			audio.oncanplay = () => {
				resolve()
			}

			// Add support for both MP3 and WAV
			const audioPath = `/audio/${_url}`

			// Test if the audio can be played
			const testAudio = new Audio()
			testAudio.src = audioPath

			testAudio.onerror = () => {
				// If WAV fails, try MP3
				const alternateFormat = _url.replace('.wav', '.mp3')
				audio.src = `/audio/${alternateFormat}`
			}

			testAudio.oncanplay = () => {
				// Original format works
				audio.src = audioPath
			}

			audio.load()
			audio.play().catch((e) => {
				console.error('Error playing audio:', e)
				reject(e)
			})
		})
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
// import * as Tone from 'tone'

// // Module-level variables to maintain state
// let player = null
// let analyser = null
// let context = null

// export function analyzeAudio(url) {
// 	let dataArray
// 	let bufferTime

// 	async function initAudio() {
// 		console.log('running')

// 		// Create or reuse context
// 		if (!context) {
// 			context = Tone.context
// 		}

// 		// Create new player if we don't have one
// 		if (!player) {
// 			// Create and configure the player
// 			player = new Tone.Player().toDestination()

// 			// Create analyzer nodes - one for frequency, one for waveform
// 			analyser = new Tone.Analyser({
// 				type: 'fft',
// 				size: 512,
// 				smoothing: 0.8,
// 			})

// 			// Connect player to analyzer
// 			player.connect(analyser)
// 		}

// 		// Initialize data arrays with correct sizes
// 		const bufferLength = analyser.size / 2
// 		dataArray = new Float32Array(bufferLength)
// 		bufferTime = new Float32Array(bufferLength)

// 		// Ensure Tone.js context is started
// 		await Tone.start()

// 		return { context, analyser }
// 	}

// 	function stopAudio() {
// 		console.log('stopping')
// 		if (player) {
// 			player.stop()
// 		}
// 		return { context, analyser } // Return context and analyser to match original API
// 	}

// 	async function swapSongs(_url) {
// 		try {
// 			// Stop current playback if any
// 			if (player && player.state === 'started') {
// 				player.stop()
// 			}

// 			// Load and play new audio
// 			await player.load(`/audio/${_url}`)
// 			player.start()
// 		} catch (error) {
// 			console.error('Error swapping songs:', error)
// 		}
// 	}

// 	function getAverageFrequency(dataArray) {
// 		if (!dataArray || dataArray.length === 0) return 0

// 		let value = 0
// 		for (let i = 0; i < dataArray.length; i++) {
// 			value += Math.abs(dataArray[i] || 0)
// 		}
// 		return value / dataArray.length
// 	}

// 	function getRMS(bufferTime) {
// 		if (!bufferTime || bufferTime.length === 0) return 0

// 		let rms = 0
// 		for (let i = 0; i < bufferTime.length; i++) {
// 			rms += (bufferTime[i] || 0) * (bufferTime[i] || 0)
// 		}
// 		rms /= bufferTime.length
// 		rms = Math.sqrt(rms)
// 		return rms
// 	}

// 	function mapper(value, x1, y1, x2, y2) {
// 		return ((value - x1) * (y2 - x2)) / (y1 - x1) + x2
// 	}

// 	function analyze() {
// 		try {
// 			if (!analyser)
// 				return {
// 					amplitude: 0,
// 					frequency: 0,
// 					lower: 0,
// 					middle: 0,
// 					upper: 0,
// 				}

// 			// Get frequency data safely
// 			const frequencyData = analyser.getValue()

// 			// Safely copy data into our arrays
// 			const len = Math.min(dataArray.length, frequencyData.length)
// 			for (let i = 0; i < len; i++) {
// 				// Convert from dB (-Infinity to 0) to 0-256 range, handling potential NaN values
// 				const value = frequencyData[i]
// 				dataArray[i] = isFinite(value) ? (value + 140) * 1.83 : 0
// 			}

// 			// Get waveform data safely
// 			const waveformData = analyser.getValue()
// 			const waveformLen = Math.min(bufferTime.length, waveformData.length)
// 			for (let i = 0; i < waveformLen; i++) {
// 				bufferTime[i] = waveformData[i] || 0
// 			}

// 			let lower = 0,
// 				middle = 0,
// 				upper = 0

// 			for (let i = 0; i < len; i++) {
// 				let freqToHerz = i * (48000 / 512)
// 				if (freqToHerz <= 500) {
// 					lower = mapper(dataArray[i], 0, 256, 0, 1.0)
// 				} else if (500 < freqToHerz && freqToHerz <= 2000) {
// 					middle = mapper(dataArray[i], 0, 256, 0, 1.0)
// 				} else if (2000 < freqToHerz && freqToHerz <= 10000) {
// 					upper = mapper(dataArray[i], 0, 256, 0, 1.0)
// 				}
// 			}

// 			let averageAmplitude = getRMS(bufferTime)
// 			let averageFreq = getAverageFrequency(dataArray)

// 			return {
// 				amplitude: isFinite(averageAmplitude) ? averageAmplitude : 0,
// 				frequency: isFinite(averageFreq) ? averageFreq : 0,
// 				lower: isFinite(lower) ? lower : 0,
// 				middle: isFinite(middle) ? middle : 0,
// 				upper: isFinite(upper) ? upper : 0,
// 			}
// 		} catch (error) {
// 			console.error('Error analyzing audio:', error)
// 			return {
// 				amplitude: 0,
// 				frequency: 0,
// 				lower: 0,
// 				middle: 0,
// 				upper: 0,
// 			}
// 		}
// 	}

// 	return {
// 		analyze,
// 		initAudio,
// 		swapSongs,
// 		stopAudio,
// 	}
// }
