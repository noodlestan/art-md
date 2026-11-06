import type { NaturalExpression } from '../../NaturalExpression/index.js';
import type { Tag } from '../../Tag/index.js';

/** The data `createFieldInline` accepts: a `name` plus optional inline `children` and `tags`. */
export type FieldInlineFactoryData = {
	name: string;
	children?: NaturalExpression[];
	tags?: Tag[];
};
