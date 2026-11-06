/**
 * The set of mdast node types that carry block-level content.
 *
 * Nodes listed here are treated as {@link https://github.com/syntax-tree/mdast#block-content|Block Content},
 * everything else falls through as phrasing content. The set is intentionally
 * generic — it lists node types, not product concepts — so no special case per
 * node is needed downstream.
 */
export const BLOCK_TYPES = new Set([
	'paragraph',
	'code',
	'list',
	'blockquote',
	'table',
	'thematicBreak',
	'html',
	'definition',
]);
