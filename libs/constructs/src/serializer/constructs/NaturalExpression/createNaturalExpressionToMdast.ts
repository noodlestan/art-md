import type { Node } from 'mdast';

import type { NaturalExpression } from '../../../factories/index.js';
import type { ConstructSerializer } from '../../types.js';

/**
 * Creates the `NaturalExpression` serializer, which emits a node shaped by
 * the expression's `type`, `value`, and `attributes`.
 */
export function createNaturalExpressionToMdast(): ConstructSerializer {
	return {
		name: 'NaturalExpression',
		toMdast(node, children) {
			const expression = node as unknown as NaturalExpression;
			const attributes = { ...expression.attributes };
			return { type: expression.type, value: expression.value, children, ...attributes } as Node;
		},
	};
}
