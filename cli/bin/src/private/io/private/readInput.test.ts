import { rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { Readable } from 'node:stream';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { makeTempDir } from '../../../test/helpers/makeTempDir';

import { readInput } from './readInput';

const ENCODING = 'utf8';
const STDIN_TARGET = '-';
const STDIN_CONTENT = 'from stdin';

describe('readInput', () => {
	const tempDirs: string[] = [];
	let tempDir: string;

	beforeEach(() => {
		tempDir = makeTempDir(tempDirs);
	});

	afterEach(async () => {
		const removals = tempDirs.splice(0).map(dir => rm(dir, { recursive: true, force: true }));
		await Promise.all(removals);
	});

	it('GIVEN a file path, returns the file content', async () => {
		const path = join(tempDir, 'input.md');
		await writeFile(path, '# Title', ENCODING);

		const content = await readInput(path);

		expect(content).toBe('# Title');
	});

	it('GIVEN a missing file path, rejects', async () => {
		const path = join(tempDir, 'missing.md');

		await expect(readInput(path)).rejects.toThrow();
	});

	it('GIVEN the stdin marker, reads stdin', async () => {
		const stdin = Readable.from([STDIN_CONTENT]);

		const content = await readInput(STDIN_TARGET, stdin);

		expect(content).toBe(STDIN_CONTENT);
	});

	it('GIVEN no path, reads stdin', async () => {
		const stdin = Readable.from([STDIN_CONTENT]);

		const content = await readInput(undefined, stdin);

		expect(content).toBe(STDIN_CONTENT);
	});

	it('GIVEN a multi-chunk stdin, joins every chunk', async () => {
		const stdin = Readable.from(['# Title', '\n\n', 'Some prose.']);

		const content = await readInput(STDIN_TARGET, stdin);

		expect(content).toBe('# Title\n\nSome prose.');
	});
});
