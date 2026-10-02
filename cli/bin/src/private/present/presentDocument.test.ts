import { createArtCodec } from '@art-md/codec';
import type { ArtDocument } from '@art-md/primitives';
import { describe, expect, it } from 'vitest';

import { presentDocument } from './presentDocument';

const codec = createArtCodec();

const DOCUMENT: ArtDocument = codec.parse('# Title\n\nSome prose.').document;

const OUTLINE = [
	'Document',
	'  SectionBlock: Title',
	'    NaturalBlock',
	'      NaturalExpression',
];

describe('presentDocument', () => {
	it('WHEN json is not set, returns the construct outline', () => {
		const presented = presentDocument(DOCUMENT, {});

		expect(presented).toBe(OUTLINE.join('\n'));
	});

	it('WHEN json is false, returns the construct outline', () => {
		const presented = presentDocument(DOCUMENT, { json: false });

		expect(presented).toBe(OUTLINE.join('\n'));
	});

	it('WHEN json is set, returns the indented JSON document', () => {
		const presented = presentDocument(DOCUMENT, { json: true });

		expect(presented).toBe(JSON.stringify(DOCUMENT, null, 2));
		expect(JSON.parse(presented)).toEqual(DOCUMENT);
	});

	it('GIVEN a document without children, returns the root line only', () => {
		const presented = presentDocument({ construct: 'Document', children: [] }, {});

		expect(presented).toBe('Document');
	});
});
