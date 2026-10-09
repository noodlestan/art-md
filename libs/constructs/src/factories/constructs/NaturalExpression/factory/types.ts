import type { NaturalExpression } from '../types.js';

export type NaturalExpressionFactoryData = {
	type: string;
	value?: string;
	attributes?: Record<string, unknown>;
	children?: NaturalExpression[];
};
