import type { ConstructBase } from '@art-md/primitives';

import type { Tag } from '../../Tag/index.js';

/** The data `createSectionBlock` accepts: a `name` plus optional `depth`, `children`, and `tags`. */
export type SectionBlockFactoryData = {
	name: string;
	depth?: number;
	children?: ConstructBase[];
	tags?: Tag[];
};
