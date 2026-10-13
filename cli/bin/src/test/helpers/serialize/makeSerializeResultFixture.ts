import type { SerializeResult } from '@art-md/primitives';

/** @provides a SerializeResult fixture for the given content and uri */
export function makeSerializeResultFixture(content: string, uri = 'document.art'): SerializeResult {
	return {
		content,
		context: { uri },
	};
}
