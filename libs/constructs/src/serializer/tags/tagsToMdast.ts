import type { Text } from 'mdast';

import type { Tag } from '../../factories/index.js';

import { tagToMdast } from './tagToMdast.js';

/** Joins a construct's tags into a single leading-space text node. */
export function tagsToMdast(tags: Tag[]): Text {
	const value = tags.map(tag => tagToMdast(tag).value).join(' ');
	return { type: 'text', value: ` ${value}` };
}
