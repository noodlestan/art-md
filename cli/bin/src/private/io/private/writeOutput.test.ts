import { readFile, rm } from 'node:fs/promises';
import { join } from 'node:path';
import process from 'node:process';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { makeTempDir } from '../../../test/helpers/makeTempDir';

import { writeOutput } from './writeOutput';

const ENCODING = 'utf8';
const CONTENT = '# Title';
const TERMINATED_CONTENT = `${CONTENT}\n`;
const PRETERMINATED_CONTENT = '# Title\n\n';

function spyOnStdoutWrite(chunks: string[]): ReturnType<typeof vi.spyOn> {
	return vi.spyOn(process.stdout, 'write').mockImplementation(((
		chunk: string,
		callback?: () => void,
	): boolean => {
		chunks.push(chunk);
		if (callback) {
			callback();
		}
		return true;
	}) as unknown as typeof process.stdout.write);
}

describe('writeOutput', () => {
	const tempDirs: string[] = [];
	let tempDir: string;

	beforeEach(() => {
		tempDir = makeTempDir(tempDirs);
	});

	afterEach(async () => {
		vi.restoreAllMocks();
		const removals = tempDirs.splice(0).map(dir => rm(dir, { recursive: true, force: true }));
		await Promise.all(removals);
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
