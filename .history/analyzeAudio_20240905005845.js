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
	audio.src = '/sounds/376737_Skullbeatz___Bad_Cat_Maste.mp3'
	audio.load()
	audio.play()
	initAudio()
	function initAudio() {
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
		for (let i = 0; i < dataArray.length; i++) {
			let freqToHerz = i * (48000 / 512)
			if (freqToHerz <= 500) {
				let lower = mapper(dataArray[i], 0, 256, 0, 1.0)
				innerMaterial.uniforms.uLowF.value = lower
			} else if (500 < freqToHerz <= 2000) {
				let middle = mapper(dataArray[i], 0, 256, 0, 1.0)
				innerMaterial.uniforms.uMidF.value = middle
			} else if (2000 < freqToHerz <= 10000) {
				let upper = mapper(dataArray[i], 0, 256, 0, 1.0)
				innerMaterial.uniforms.uHighF.value = upper
			}
		}
		let averageAmplitude = getRMS(bufferTime)
		let averageFreq = getAverageFrequency(dataArray)
		return [averageAmplitude, averageFreq]
	}
}
