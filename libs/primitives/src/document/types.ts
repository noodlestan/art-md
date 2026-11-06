import type { ConstructBase, ContainerConstructBase } from '../constructs/index.js';

/** The document root — a `Document` construct carrying the top-level children. */
export type ArtDocument = ContainerConstructBase & {
	construct: 'Document';
};

/** The data `createArtDocument` accepts: the document's children. */
export type ArtDocumentFactoryData = {
	children: ConstructBase[];
};
