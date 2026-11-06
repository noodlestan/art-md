import type { NaturalExpression } from '../types.js';

/** The data `createNaturalExpression` accepts: a `type` plus optional `value`, `attributes`, and `children`. */
export type NaturalExpressionFactoryData = {
	type: string;
	value?: string;
	attributes?: Record<string, unknown>;
	children?: NaturalExpression[];
};
