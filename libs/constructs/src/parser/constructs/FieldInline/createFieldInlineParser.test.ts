import { describe, expect, it } from 'vitest';

import { createFieldInlineParser } from './createFieldInlineParser.js';

describe('createFieldInlineParser', () => {
	it('WHEN called returns a parser with FieldInline name, processor and factory', () => {
		const parser = createFieldInlineParser();

		expect(parser.name).toBe('FieldInline');
		expect(parser.processor).toBeDefined();
	});
});
