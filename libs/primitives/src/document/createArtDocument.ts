import type { ArtDocument, ArtDocumentFactoryData } from './types.js';

export function createArtDocument(data?: ArtDocumentFactoryData): ArtDocument {
	return {
		construct: 'Document',
		children: data?.children ?? [],
	};
}
