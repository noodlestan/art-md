import type { Tag } from '../types.js';

import type { TagFactoryData } from './types.js';

/** Builds a `Tag` from `tagData`. */
export function createTag(tagData: TagFactoryData): Tag {
	return { construct: 'Tag' as const, name: tagData.name };
}
