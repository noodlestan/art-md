import type { ArtDocument } from '@art-md/primitives';

export function readDocument(source: string): ArtDocument {
	return JSON.parse(source) as ArtDocument;
}
