import { readInput } from './private/readInput.js';
import { writeOutput } from './private/writeOutput.js';
import type { CommandIo } from './types.js';

export function createCommandIo(): CommandIo {
	return {
		readInput,
		writeOutput,
	};
}
