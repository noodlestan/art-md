import { type ArtDocument, nodePosition } from '@art-md/primitives';
import type { Node } from 'unist';

import { createDocument } from '../../factories/index.js';

/** Creates an `ArtDocument` from a root node, stamping it with the node's source position. */
export function createArtDocumentFromNode(root: Node): ArtDocument {
	const document = createDocument({});
	document.position = nodePosition(root);
	return document;
}
