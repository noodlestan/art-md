import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { spyOnStdoutWrite } from '../../../test/helpers/io/spyOnStdoutWrite.js';
import { makeTempDir } from '../../../test/helpers/tempDirs/makeTempDir.js';
import { removeTempDirs } from '../../../test/helpers/tempDirs/removeTempDirs.js';

import { writeOutput } from './writeOutput.js';

const ENCODING = 'utf8';
const CONTENT = '# Title';
const TERMINATED_CONTENT = `${CONTENT}\n`;
const PRETERMINATED_CONTENT = '# Title\n\n';

describe('writeOutput', () => {
	const tempDirs: string[] = [];
	let tempDir: string;

	beforeEach(() => {
		tempDir = makeTempDir(tempDirs);
	});

	afterEach(async () => {
		vi.restoreAllMocks();

		await removeTempDirs(tempDirs);
	});

	it('GIVEN a target, writes the terminated content to that file', async () => {
		const target = join(tempDir, 'output.md');

		await writeOutput(CONTENT, target);

		const written = await readFile(target, ENCODING);

		expect(written).toBe(TERMINATED_CONTENT);
	});

	it('GIVEN no target, writes the terminated content to stdout', async () => {
		const chunks: string[] = [];
		const writeSpy = spyOnStdoutWrite(chunks);

		await writeOutput(CONTENT);

		expect(writeSpy).toHaveBeenCalledTimes(1);
		expect(chunks).toEqual([TERMINATED_CONTENT]);
	});

	it('GIVEN content already ending in a line ending, writes it unchanged', async () => {
		const target = join(tempDir, 'output.md');

		await writeOutput(PRETERMINATED_CONTENT, target);

		const written = await readFile(target, ENCODING);

		expect(written).toBe(PRETERMINATED_CONTENT);
	});
});
