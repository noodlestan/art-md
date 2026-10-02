import { readFile, rm } from 'node:fs/promises';
import { join } from 'node:path';
import process from 'node:process';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { makeTempDir } from '../../test/helpers/makeTempDir';

import { writeOutput } from './writeOutput';

const ENCODING = 'utf8';
const CONTENT = '# Title';

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

	it('GIVEN a target, writes the content to that file', async () => {
		const target = join(tempDir, 'output.md');

		await writeOutput(CONTENT, target);

		const written = await readFile(target, ENCODING);
		expect(written).toBe(CONTENT);
	});

	it('GIVEN no target, writes the content to stdout', async () => {
		const chunks: string[] = [];
		const writeSpy = spyOnStdoutWrite(chunks);

		await writeOutput(CONTENT);

		expect(writeSpy).toHaveBeenCalledTimes(1);
		expect(chunks).toEqual([CONTENT]);
	});
});
