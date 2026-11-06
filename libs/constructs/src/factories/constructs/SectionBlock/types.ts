import type { ConstructBase, ContainerConstructBase } from '@art-md/primitives';

import type { Tag } from '../Tag/index.js';

/** A block-level construct pairing a heading `name` with optional `depth`, `children`, and `tags`. */
export type SectionBlock = ContainerConstructBase & {
	construct: 'SectionBlock';
	name: string;
	tags?: Tag[];
	children: ConstructBase[];
	depth?: number;
};
