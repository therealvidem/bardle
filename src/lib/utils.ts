import type { Keyboard } from '@etsoo/shared';
import { writable, type Writable } from 'svelte/store';
import { emojiMappings, maxGuesses, type Guess, type PlayerWord } from './types';
import type { StatisticsStore } from '$lib/stores/statistics_store';

export function keyToCharacter(key: Keyboard.Codes) {
	return key[3].toLowerCase();
}

export function characterToKey(character: string): Keyboard.Keys {
	return `Key${character.toUpperCase()}` as Keyboard.Keys;
}

export function guessListToEmojis(guesses: Guess[]) {
	return guesses
		.map((g) => {
			if (g.guessed) {
				return g.feedback.hint.letters.map((f) => emojiMappings[f]);
			} else {
				return null;
			}
		})
		.filter((g) => g !== null);
}

export function copyGuessesToClipboard(
	statisticsStore: StatisticsStore,
	currentWord: PlayerWord,
	addToast: (message: string) => void = undefined
) {
	const guessesEmojis = guessListToEmojis(statisticsStore.getGuesses(currentWord));

	let resultsString = '';
	resultsString += `BARdle ${currentWord.num} ${guessesEmojis.length}/${maxGuesses}`;
	resultsString += '\n\n';
	resultsString += guessesEmojis.map((r) => r.join('')).join('\n');

	navigator.clipboard
		.writeText(resultsString)
		.then(() => {
			if (addToast) {
				addToast('Copied results to clipboard!');
			}
		})
		.catch(() => {
			if (addToast) {
				addToast('Something went wrong while trying to copy to the clipboard.');
			}
		});
}

export function getWritableIntFromStorage(
	localStorage: Storage,
	name: string,
	defaultValue: number = 0
): Writable<number> {
	if (localStorage.getItem(name) === null) {
		return writable(defaultValue);
	} else {
		return writable(parseInt(localStorage.getItem(name)));
	}
}

export function getWritableNumberFromStorage(
	localStorage: Storage,
	name: string,
	defaultValue: number = 0
): Writable<number> {
	if (localStorage.getItem(name) === null) {
		return writable(defaultValue);
	} else {
		return writable(parseFloat(localStorage.getItem(name)));
	}
}

export function getWritableBooleanFromStorage(
	localStorage: Storage,
	name: string,
	defaultValue: boolean = false
): Writable<boolean> {
	if (localStorage.getItem(name) === null) {
		return writable(defaultValue);
	} else {
		return writable(localStorage.getItem(name) === 'true');
	}
}

export function autoUpdateWritableStorage<T>(
	localStorage: Storage,
	name: string,
	writable: Writable<T>
) {
	writable.subscribe((v) => localStorage.setItem(name, `${v}`));
}
