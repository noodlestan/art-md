import type { Text } from 'mdast';

import type { Tag } from '../../factories/index.js';

import { tagToMdast } from './tagToMdast.js';

export function tagsToMdast(tags: Tag[]): Text {
	const value = tags.map(tag => tagToMdast(tag).value).join(' ');
	return { type: 'text', value: ` ${value}` };
}
