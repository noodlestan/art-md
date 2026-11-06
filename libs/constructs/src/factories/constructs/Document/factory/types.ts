import type { BlockContent } from '../../../types.js';

/** The data `createDocument` accepts: the document's optional children. */
export type DocumentFactoryData = {
	children?: BlockContent[];
};
