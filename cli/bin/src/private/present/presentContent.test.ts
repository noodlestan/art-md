import { describe, expect, it } from 'vitest';

import { presentContent } from './presentContent';

const CONTENT = '# Title';

describe('presentContent', () => {
	it('WHEN json is not set, returns the content unchanged', () => {
		const presented = presentContent(CONTENT, {});

		expect(presented).toBe(CONTENT);
	});

	it('WHEN json is false, returns the content unchanged', () => {
		const presented = presentContent(CONTENT, { json: false });

		expect(presented).toBe(CONTENT);
	});

	it('WHEN json is set, returns the indented JSON payload', () => {
		const presented = presentContent(CONTENT, { json: true });

		expect(presented).toBe(JSON.stringify({ content: CONTENT }, null, 2));
		expect(JSON.parse(presented)).toEqual({ content: CONTENT });
	});
});
