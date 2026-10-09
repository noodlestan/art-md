import { readFile } from 'node:fs/promises';

import { readStdin } from './readStdin.js';

const STDIN_TARGET = '-';
const ENCODING = 'utf8';

export async function readInput(path?: string, stdin?: NodeJS.ReadableStream): Promise<string> {
	if (path === undefined || path === STDIN_TARGET) {
		return readStdin(stdin);
	}
	return readFile(path, ENCODING);
}
