import type { NaturalExpression } from '../../NaturalExpression/index.js';
import type { Tag } from '../../Tag/index.js';

export type FieldInlineFactoryData = {
	name: string;
	children?: NaturalExpression[];
	tags?: Tag[];
};
