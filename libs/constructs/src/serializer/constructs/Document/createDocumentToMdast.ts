import type { Node } from 'mdast';

import type { ConstructSerializer } from '../../types.js';

/** Creates the `Document` serializer, which wraps children in a `root` node. */
export function createDocumentToMdast(): ConstructSerializer {
	return {
		name: 'Document',
		toMdast(_node, children) {
			return {
				type: 'root',
				children,
			} as Node;
		},
	};
}
