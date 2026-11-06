import type { ContainerConstructBase } from '@art-md/primitives';

import type { BlockContent } from '../../types.js';
import type { Tag } from '../Tag/index.js';

/** A block-level construct pairing a `name` label with `children` and optional `tags`. */
export type FieldBlock = ContainerConstructBase & {
	construct: 'FieldBlock';
	name: string;
	children: BlockContent[];
	tags?: Tag[];
};
