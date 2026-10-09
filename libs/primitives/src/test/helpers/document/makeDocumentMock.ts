import type { ConstructBase } from '../../../constructs/index.js';
import type { ArtDocument } from '../../../document/index.js';

export const makeDocumentMock = <T extends ConstructBase = never>(options?: {
	children?: T[];
}): ArtDocument => ({
	construct: 'Document',
	children: (options?.children ?? []) as T[],
});
