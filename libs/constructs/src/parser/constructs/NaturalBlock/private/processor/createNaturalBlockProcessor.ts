import type { ConstructProcessor } from '../../../../types.js';
import { createNaturalBlockFromNode } from '../helpers/createNaturalBlockFromNode.js';

export function createNaturalBlockProcessor(): ConstructProcessor {
	return {
		captureNode(context, node) {
			return createNaturalBlockFromNode(node, context);
		},
	};
}
