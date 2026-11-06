import type { NaturalExpression } from '../types.js';

import type { NaturalExpressionFactoryData } from './types.js';

/** Builds a `NaturalExpression` from `data`, defaulting `children` to an empty list. */
export function createNaturalExpression(data: NaturalExpressionFactoryData): NaturalExpression {
	return {
		construct: 'NaturalExpression',
		type: data.type,
		value: data.value,
		attributes: data.attributes,
		children: data.children ?? [],
	};
}
