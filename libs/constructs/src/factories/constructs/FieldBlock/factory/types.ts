import type { BlockContent } from '../../../types.js';
import type { Tag } from '../../Tag/index.js';

/** The data `createFieldBlock` accepts: a `name` plus optional `children` and `tags`. */
export type FieldBlockFactoryData = {
	name: string;
	children?: BlockContent[];
	tags?: Tag[];
};
