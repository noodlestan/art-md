import { createArtCodec } from '@art-md/codec';
import type { ArtDocument } from '@art-md/primitives';
import { describe, expect, it } from 'vitest';

import { presentDocument } from './presentDocument';

const codec = createArtCodec();

const DOCUMENT: ArtDocument = codec.parse('# Title\n\nSome prose.').document;

describe('presentDocument', () => {
	it('returns the indented JSON document', () => {
		const presented = presentDocument(DOCUMENT);

		expect(presented).toBe(JSON.stringify(DOCUMENT, null, 2));
		expect(JSON.parse(presented)).toEqual(DOCUMENT);
	});

	it('GIVEN a document without children, returns an empty children array', () => {
		const presented = presentDocument({ construct: 'Document', children: [] });

		expect(JSON.parse(presented)).toEqual({ construct: 'Document', children: [] });
	});
});
