import { type ArtDocument, createArtDocument } from '@art-md/primitives';

import type { DocumentFactoryData } from './types.js';

export function createDocument(data: DocumentFactoryData): ArtDocument {
	const docData = {
		...data,
		children: data.children || [],
	};
	return createArtDocument(docData);
}
