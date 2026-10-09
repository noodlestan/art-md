import process from 'node:process';

import { afterEach, describe, expect, it, vi } from 'vitest';

import { writeStdout } from './writeStdout.js';

function spyOnStdoutWrite(): ReturnType<typeof vi.spyOn> {
	return vi.spyOn(process.stdout, 'write').mockImplementation(((
		chunk: string,
		callback?: () => void,
	): boolean => {
		if (callback) {
			callback();
		}
		return true;
	}) as unknown as typeof process.stdout.write);
}

describe('writeStdout', () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('GIVEN content, writes it to stdout and resolves', async () => {
		const writeSpy = spyOnStdoutWrite();

		await writeStdout('# Title');

		expect(writeSpy).toHaveBeenCalledWith('# Title', expect.any(Function));
	});
});
