import type { Paragraph } from 'mdast';

import { isFieldStrong } from '../../../../fields/index.js';
import type { ConstructProcessor } from '../../../../types.js';
import { createFieldInlineFromNode } from '../helpers/createFieldInlineFromNode.js';

export function createFieldInlineProcessor(): ConstructProcessor {
	return {
		captureNode(context, node) {
			if (node.type !== 'paragraph') {
				return null;
			}
			const paragraph = node as Paragraph;
			const first = paragraph.children[0];
			if (first === undefined || !isFieldStrong(first, context)) {
				return null;
			}
			return createFieldInlineFromNode(paragraph, context);
		},
	};
}
