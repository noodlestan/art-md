import { afterEach, describe, expect, it, vi } from 'vitest';

import { spyOnStdoutWrite } from '../../../test/helpers/io/spyOnStdoutWrite.js';

import { writeStdout } from './writeStdout.js';

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
