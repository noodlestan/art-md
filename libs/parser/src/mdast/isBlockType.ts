import { BLOCK_TYPES } from './constants.js';

/**
 * Reports whether an mdast node type carries block-level content.
 *
 * Answers from {@link mdast#BLOCK_TYPES} — a node is a block exactly when its
 * type is a member of that set.
 *
 * @param {string} type - The mdast `node.type` to classify.
 * @returns {boolean} `true` when the type is a block-level node.
 */
export function isBlockType(type: string): boolean {
	return BLOCK_TYPES.has(type);
}
