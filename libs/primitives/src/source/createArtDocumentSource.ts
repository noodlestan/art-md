import type { ArtCodec } from '../codec/types';
import type { ArtDocument } from '../document';

import type { ArtContentSource, ArtDocumentSource } from './types';

export function createArtDocumentSource(
	codec: ArtCodec,
	contentSource: ArtContentSource,
): ArtDocumentSource {
	let cached: ArtDocument | undefined;

	return {
		type: contentSource.type,
		uri: contentSource.uri,
		get maybeDocument() {
			return cached;
		},
		async readDocument() {
			if (cached) return cached;
			const content = await contentSource.readContent();
			const result = codec.parse(content);
			cached = result.document;
			return cached;
		},
		async writeDocument(doc) {
			const result = codec.serialize(doc);
			await contentSource.writeContent(result.content);
			cached = doc;
		},
	};
}
