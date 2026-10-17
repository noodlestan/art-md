import type { ConstructBase, ContainerConstructBase } from '@art-md/primitives';

import type { Tag } from '../Tag/index.js';

export type SectionBlock = ContainerConstructBase & {
	construct: 'SectionBlock';
	name: string;
	tags?: Tag[];
	children: ConstructBase[];
	depth?: number;
};
