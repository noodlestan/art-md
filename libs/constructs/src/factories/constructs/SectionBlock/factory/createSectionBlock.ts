import type { SectionBlock } from '../types.js';

import type { SectionBlockFactoryData } from './types.js';

/**
 * Builds a `SectionBlock` from `data`, defaulting `children` to an empty
 * list and applying `depth` and `tags` only when given.
 */
export function createSectionBlock(data: SectionBlockFactoryData): SectionBlock {
	const section: SectionBlock = {
		construct: 'SectionBlock',
		name: data.name,
		children: data.children ?? [],
	};
	if (data.depth !== undefined) section.depth = data.depth;
	if (data.tags?.length) section.tags = data.tags;
	return section;
}
