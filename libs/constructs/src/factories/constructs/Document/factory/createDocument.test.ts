import { describe, expect, it } from 'vitest';

import type { SectionBlock } from '../../SectionBlock/index.js';

import { createDocument } from './createDocument.js';

describe('createDocument', () => {
	it('WHEN creating an ArtDocument from data', () => {
		const sectionBlock: SectionBlock = { construct: 'SectionBlock', name: 'Hello', children: [] };
		const data = { children: [sectionBlock] };

		const result = createDocument(data);

		expect(result.construct).toBe('Document');
		expect(result.children).toBe(data.children);
	});
});
