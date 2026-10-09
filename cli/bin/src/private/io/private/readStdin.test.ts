import { Readable } from 'node:stream';

import { describe, expect, it } from 'vitest';

import { readStdin } from './readStdin.js';

describe('readStdin', () => {
	it('GIVEN a readable stream, resolves its text content', async () => {
		const stdin = Readable.from(['# Title', '\n\n', 'Some prose.']);

		const content = await readStdin(stdin);

		expect(content).toBe('# Title\n\nSome prose.');
	});
});
