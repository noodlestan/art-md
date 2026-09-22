import { describe, expect, it } from 'vitest';

import { createSerializeContext } from './createSerializeContext';

describe('createSerializeContext', () => {
	it('GIVEN uri data, creates a serialize context carrying the uri', () => {
		const data = { uri: 'file:///a.md' };

		const ctx = createSerializeContext(data);

		expect(ctx.uri).toBe('file:///a.md');
	});
});
