import type { NaturalExpression } from '../types.js';

import type { NaturalExpressionFactoryData } from './types.js';

export function createNaturalExpression(data: NaturalExpressionFactoryData): NaturalExpression {
	return {
		construct: 'NaturalExpression',
		type: data.type,
		value: data.value,
		attributes: data.attributes,
		children: data.children ?? [],
	};
}
