import type { ContainerConstructBase } from '@art-md/primitives';

import type { Tag } from '../../Tag/index.js';

/**
 * The data `createNaturalBlock` accepts: a `value` and `children` plus
 * optional `type`, `lang`, `meta`, `tags`, and `attributes`.
 */
export type NaturalBlockFactoryData = {
	value: string;
	children: ContainerConstructBase[];
	type?: string;
	lang?: string | null;
	meta?: string | null;
	tags?: Tag[];
	attributes?: Record<string, unknown>;
};
