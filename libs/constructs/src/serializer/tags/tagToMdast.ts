import type { Text } from 'mdast';

import type { Tag } from '../../factories/index.js';

/** Renders one tag as a text node with its `(#name)` value. */
export function tagToMdast(tag: Tag): Text {
	return { type: 'text', value: `(#${tag.name})` };
}
