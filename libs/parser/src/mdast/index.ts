/**
 * mdast classification helpers.
 *
 * Exposes the block-level node set and the predicate over it, which draw the
 * block/phrasing boundary during the visit — consulted by `buildDocument`
 * after construct parsers have had their chance to claim a node. The helpers
 * stay generic: mdast node types, not product-level constructs.
 *
 * @see `knowledge/parser.md` for the block/phrasing boundary.
 */
export { BLOCK_TYPES } from './constants.js';
export { isBlockType } from './isBlockType.js';
