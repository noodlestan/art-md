import type { ContainerConstructBase } from '@art-md/primitives';

import type { NaturalExpression } from '../NaturalExpression/index.js';
import type { Tag } from '../Tag/index.js';

export type FieldInline = ContainerConstructBase & {
	construct: 'FieldInline';
	name: string;
	children: NaturalExpression[];
	tags?: Tag[];
};
