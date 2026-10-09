import type { BlockContent } from '../../../types.js';
import type { Tag } from '../../Tag/index.js';

export type FieldBlockFactoryData = {
	name: string;
	children?: BlockContent[];
	tags?: Tag[];
};
