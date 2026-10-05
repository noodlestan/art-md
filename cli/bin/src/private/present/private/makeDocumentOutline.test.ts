import { describe, expect, it } from 'vitest';

import { makeDocumentOutline } from './makeDocumentOutline';

const ROOT = { construct: 'Document' };
const LABELLED = { construct: 'SectionBlock', name: 'Title' };

describe('makeDocumentOutline', () => {
	it('GIVEN a root without a name, returns the construct alone', () => {
		const lines = makeDocumentOutline(ROOT);

		expect(lines).toEqual(['Document']);
	});

	it('GIVEN a named node, labels the line with the name', () => {
		const lines = makeDocumentOutline(LABELLED);

		expect(lines).toEqual(['SectionBlock: Title']);
	});

	it('GIVEN a root without a children property, returns the root line only', () => {
		const lines = makeDocumentOutline(ROOT);

		expect(lines).toHaveLength(1);
	});

	it('GIVEN nested children, indents every level', () => {
		const document = {
			construct: 'Document',
			children: [
				{
					construct: 'SectionBlock',
					name: 'Title',
					children: [{ construct: 'NaturalBlock' }],
				},
			],
		};

		const lines = makeDocumentOutline(document);

		expect(lines).toEqual(['Document', '  SectionBlock: Title', '    NaturalBlock']);
	});
});
