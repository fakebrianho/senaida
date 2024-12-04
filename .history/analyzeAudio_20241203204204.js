import * as Tone from 'tone'

let context, source, analyser

export function analyzeAudio() {
	function initAudio() {
		// Use Tone.js context instead of creating a new one
		context = Tone.getContext().rawContext
		analyser = context.createAnalyser()
		analyser.fftSize = 512

		// Connect Tone.js player to our analyzer
		if (audioEffects && audioEffects.player) {
			audioEffects.player.connect(analyser)
			analyser.connect(context.destination)
		}

		const bufferLength = analyser.frequencyBinCount
		const dataArray = new Uint8Array(bufferLength)
		const bufferTime = new Uint8Array(bufferLength)
		analyser.getByteTimeDomainData(bufferTime)

		return { dataArray, bufferTime }
	}

	function analyze() {
		if (!analyser) return null

		const bufferLength = analyser.frequencyBinCount
		const dataArray = new Uint8Array(bufferLength)
		analyser.getByteFrequencyData(dataArray)

		const lowerHalf = Math.floor(bufferLength / 4)
		const upperHalf = Math.floor(bufferLength / 2)
		let sum = 0
		let sumSquares = 0

		for (let i = 0; i < bufferLength; i++) {
			sum += dataArray[i]
			sumSquares += dataArray[i] * dataArray[i]
		}

		const average = sum / bufferLength
		const variance = sumSquares / bufferLength - average * average
		const amplitude = Math.sqrt(variance)

		return {
			frequency: average / 128.0,
			amplitude: amplitude / 128.0,
			lower: getAverageFrequency(dataArray.slice(0, lowerHalf)) / 128.0,
			middle:
				getAverageFrequency(dataArray.slice(lowerHalf, upperHalf)) /
				128.0,
			upper: getAverageFrequency(dataArray.slice(upperHalf)) / 128.0,
		}
	}

	function stopAudio() {
		if (analyser) {
			analyser.disconnect()
		}
		return { context, analyser }
	}

	function getAverageFrequency(dataArray) {
		let value = 0
		const data = dataArray
		for (let i = 0; i < data.length; i++) {
			value += data[i]
		}
		return value / data.length
	}

	return {
		initAudio,
		analyze,
		stopAudio,
	}
}
