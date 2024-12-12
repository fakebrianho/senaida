const SONG_URLS = {
	1: [
		'REBIRTH_remix_drums.wav',
		'REBIRTH_remix_melody.wav',
		'REBIRTH_remix_noise.wav',
	],
	2: [
		'FRAGILE_remix_drums.wav',
		'FRAGILE_remix_melody.wav',
		'FRAGILE_remix_noise.wav',
	],
	3: [
		'JUDGEMENT_remix_drums.wav',
		'JUDGEMENT_remix_melody.wav',
		'JUDGEMENT_remix_noise.wav',
	],
	4: [
		'MIMESIS_remix_drums.wav',
		'MIMESIS_remix_melody.wav',
		'MIMESIS_remix_noise.wav',
	],
	5: [
		'WANDERER_remix_drums.wav',
		'WANDERER_remix_melody.wav',
		'WANDERER_remix_noise.wav',
	],
}
export function getRandomRemixUrl(songNumber) {
	if (!SONG_URLS[songNumber]) {
		console.error('Invalid song number:', songNumber)
		return null
	}
	const songArray = SONG_URLS[songNumber]
	const randomIndex = Math.floor(Math.random() * songArray.length)
	return `/masterAudio/remix/${songArray[randomIndex]}`
}
