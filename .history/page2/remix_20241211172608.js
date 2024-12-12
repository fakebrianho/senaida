const SONG_URLS = {
	1: [
		'/masterAudio/remix/1/REBIRTH_remix_1.wav',
		'/masterAudio/remix/1/REBIRTH_remix_2.mp3',
		'/masterAudio/remix/1/REBIRTH_remix_3.mp3',
		'/masterAudio/remix/1/REBIRTH_remix_4.mp3',
		'/masterAudio/remix/1/REBIRTH_remix_5.wav',
	],
	2: [
		'/masterAudio/remix/2/FRAGILE_remix_1.mp3',
		'/masterAudio/remix/2/FRAGILE_remix_2.mp3',
		'/masterAudio/remix/2/FRAGILE_remix_3.mp3',
		'/masterAudio/remix/2/FRAGILE_remix_4.mp3',
		'/masterAudio/remix/2/FRAGILE_remix_5.mp3',
	],
	3: [
		'/masterAudio/remix/3/POTH_remix_1.mp3',
		'/masterAudio/remix/3/POTH_remix_2.mp3',
		'/masterAudio/remix/3/POTH_remix_3.mp3',
		'/masterAudio/remix/3/POTH_remix_4.mp3',
		'/masterAudio/remix/3/POTH_remix_5.wav',
	],
	4: [
		'/masterAudio/remix/4/CURIOSITY_remix_1.mp3',
		'/masterAudio/remix/4/CURIOSITY_remix_2.mp3',
		'/masterAudio/remix/4/CURIOSITY_remix_3.mp3',
		'/masterAudio/remix/4/CURIOSITY_remix_4.mp3',
		'/masterAudio/remix/4/CURIOSITY_remix_5.mp3',
	],
	5: [
		'/masterAudio/remix/5/WANDERER_remix_1.mp3',
		'/masterAudio/remix/5/WANDERER_remix_2.mp3',
		'/masterAudio/remix/5/WANDERER_remix_3.mp3',
		'/masterAudio/remix/5/WANDERER_remix_4.mp3',
		'/masterAudio/remix/5/WANDERER_remix_5.mp3',
	],
	6: ['/masterAudio/remix/5/WANDERER_remix_5.mp3'],
}

export function getRandomRemixUrl(songNumber) {
	if (!SONG_URLS[songNumber]) {
		console.error('Invalid song number:', songNumber)
		return null
	}
	const songArray = SONG_URLS[songNumber]
	const randomIndex = Math.floor(Math.random() * songArray.length)
	return songArray[randomIndex]
}
