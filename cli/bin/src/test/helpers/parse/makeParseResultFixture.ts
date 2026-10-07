import type { ParseResult } from '@art-md/primitives';

export function makeParseResultFixture(uri = 'document.art'): ParseResult {
	return {
		document: { construct: 'Document', children: [] },
		context: { uri },
	};
}
