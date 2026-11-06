import type { ArtDocument, ArtDocumentFactoryData } from './types.js';

/** Builds an `ArtDocument`, defaulting to an empty child list when no data is given. */
export function createArtDocument(data?: ArtDocumentFactoryData): ArtDocument {
	return {
		construct: 'Document',
		children: data?.children ?? [],
	};
}
