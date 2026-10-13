import type { ParseResult } from '@art-md/primitives';

/** @provides a ParseResult fixture for a document uri */
export function makeParseResultFixture(uri = 'document.art'): ParseResult {
	return {
		document: { construct: 'Document', children: [] },
		context: { uri },
	};
}
