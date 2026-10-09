import type { ConstructBase } from '@art-md/primitives';

import type { Tag } from '../../Tag/index.js';

export type SectionBlockFactoryData = {
	name: string;
	kind?: string;
	depth?: number;
	children?: ConstructBase[];
	tags?: Tag[];
};
