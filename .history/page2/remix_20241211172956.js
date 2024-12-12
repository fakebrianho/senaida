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
	6: [
		'/masterAudio/remix/6/UNGOD_remix_1.mp3',
		'/masterAudio/remix/6/UNGOD_remix_2.mp3',
		'/masterAudio/remix/6/UNGOD_remix_3.mp3',
		'/masterAudio/remix/6/UNGOD_remix_4.mp3',
		'/masterAudio/remix/6/UNGOD_remix_5.mp3',
	],
	7: [
		'/masterAudio/remix/7/MIMESIS_remix_1.mp3',
		'/masterAudio/remix/7/MIMESIS_remix_2.mp3',
		'/masterAudio/remix/7/MIMESIS_remix_3.mp3',
		'/masterAudio/remix/7/MIMESIS_remix_4.mp3',
		'/masterAudio/remix/7/MIMESIS_remix_5.mp3',
	],
	8: [
		'/masterAudio/remix/8/XTASY_remix_1.mp3',
		'/masterAudio/remix/8/XTASY_remix_2.mp3',
		'/masterAudio/remix/8/XTASY_remix_3.mp3',
		'/masterAudio/remix/8/XTASY_remix_4.mp3',
		'/masterAudio/remix/8/XTASY_remix_5.mp3',
	],
	9: [
		'/masterAudio/remix/9/EXPLOITED_remix_1.mp3',
		'/masterAudio/remix/9/EXPLOITED_remix_2.mp3',
		'/masterAudio/remix/9/EXPLOITED_remix_3.mp3',
		'/masterAudio/remix/9/EXPLOITED_remix_4.mp3',
		'/masterAudio/remix/9/EXPLOITED_remix_5.wav',
	],
	10: [
		'/masterAudio/remix/10/DEJAVU_remix_1.mp3',
		'/masterAudio/remix/10/DEJAVU_remix_2.mp3',
		'/masterAudio/remix/10/DEJAVU_remix_3.mp3',
		'/masterAudio/remix/10/DEJAVU_remix_4.mp3',
		'/masterAudio/remix/10/DEJAVU_remix_5.mp3',
	],
	11: [
		'/masterAudio/remix/11/JUDGEMENT_remix_1.mp3',
		'/masterAudio/remix/11/JUDGEMENT_remix_2.mp3',
		'/masterAudio/remix/11/JUDGEMENT_remix_3.mp3',
		'/masterAudio/remix/11/JUDGEMENT_remix_4.mp3',
		'/masterAudio/remix/11/JUDGEMENT_remix_5.mp3',
	],
	12: [
		'/masterAudio/remix/12/CLARITY_remix_1.wav',
		'/masterAudio/remix/12/CLARITY_remix_2.wav',
		'/masterAudio/remix/12/CLARITY_remix_3.wav',
		'/masterAudio/remix/12/CLARITY_remix_4.mp3',
		'/masterAudio/remix/12/CLARITY_remix_5.mp3',
	],
	13: [
		'/masterAudio/remix/13/DISCONNECTED_remix_1.mp3',
		'/masterAudio/remix/13/DISCONNECTED_remix_2.mp3',
		'/masterAudio/remix/13/DISCONNECTED_remix_3.mp3',
		'/masterAudio/remix/13/DISCONNECTED_remix_4.mp3',
		'/masterAudio/remix/13/DISCONNECTED_remix_5.mp3',
	],
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
