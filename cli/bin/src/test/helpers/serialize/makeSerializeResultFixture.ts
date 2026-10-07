import type { SerializeResult } from '@art-md/primitives';

export function makeSerializeResultFixture(content: string, uri = 'document.art'): SerializeResult {
	return { content, context: { uri } };
}
