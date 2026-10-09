import { type MdastNode, nodePosition } from '@art-md/primitives';

import type { NaturalExpression } from '../../factories/index.js';

export function createNaturalExpressionFromNode(node: MdastNode): NaturalExpression {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { position: _, children: mdastChildren, type, value, ...attributes } = node;

	let children: NaturalExpression[] = [];
	if (Array.isArray(mdastChildren)) {
		children = mdastChildren.map((child: MdastNode) => createNaturalExpressionFromNode(child));
	}

	const expression: NaturalExpression = {
		construct: 'NaturalExpression',
		type,
		attributes,
		value,
		position: nodePosition(node),
		children,
	};

	return expression;
}
