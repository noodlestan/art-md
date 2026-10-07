import { readInput } from './private/readInput';
import { writeOutput } from './private/writeOutput';
import type { CommandIo } from './types';

export function createCommandIo(): CommandIo {
	return {
		readInput,
		writeOutput,
	};
}
