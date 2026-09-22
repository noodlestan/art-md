import { describe, expect, it } from 'vitest';

import { createParseContext } from './createParseContext';

describe('createParseContext', () => {
	it('GIVEN uri data, creates a parse context carrying the uri', () => {
		const data = { uri: 'file:///a.md' };

		const ctx = createParseContext(data);

		expect(ctx.uri).toBe('file:///a.md');
	});
});
