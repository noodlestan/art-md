import { BLOCK_TYPES } from './constants.js';

/**
 * Reports whether an mdast node type carries block-level content.
 *
 * Answers from {@link BLOCK_TYPES}, so a node is a block exactly when it is a
 * paragraph, code fence, list, blockquote, table, thematic break, HTML block, or
 * definition. The parser consults this after constructs have had their chance to
 * claim a node.
 *
 * @param {string} type - The mdast `node.type` to classify.
 * @returns {boolean} `true` when the type is a block-level node.
 */
export function isBlockType(type: string): boolean {
	return BLOCK_TYPES.has(type);
}
