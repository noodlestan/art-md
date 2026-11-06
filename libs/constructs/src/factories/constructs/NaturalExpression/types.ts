import type { ContainerConstructBase } from '@art-md/primitives';

/** An inline construct with a `type`, optional `value` and `attributes`, and nested `children`. */
export type NaturalExpression = ContainerConstructBase & {
	construct: 'NaturalExpression';
	type: string;
	attributes?: Record<string, unknown>;
	value?: string;
	children: NaturalExpression[];
};
