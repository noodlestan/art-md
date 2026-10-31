/**
 * mdast classification helpers.
 *
 * Exposes the block-level node set and the predicate over it, which together
 * draw the block/phrasing boundary during the visit. The helpers stay generic:
 * they know mdast node types, not product-level constructs.
 *
 * Consulted by `buildDocument` after construct parsers have had their chance to
 * claim a node.
 *
 * @see `knowledge/parser.md` for the block/phrasing boundary.
 */
export { BLOCK_TYPES } from './constants.js';
export { isBlockType } from './isBlockType.js';
