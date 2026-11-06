import { type ArtDocument, createArtDocument } from '@art-md/primitives';

import type { DocumentFactoryData } from './types.js';

/**
 * Builds an `ArtDocument` from `data`, defaulting `children` to an empty
 * list.
 */
export function createDocument(data: DocumentFactoryData): ArtDocument {
	const docData = {
		...data,
		children: data.children || [],
	};
	return createArtDocument(docData);
}
