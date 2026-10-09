import type { SectionBlock } from '../types.js';

import type { SectionBlockFactoryData } from './types.js';

export function createSectionBlock(data: SectionBlockFactoryData): SectionBlock {
	const section: SectionBlock = {
		construct: 'SectionBlock',
		name: data.name,
		children: data.children ?? [],
	};
	if (data.kind) section.kind = data.kind;
	if (data.depth !== undefined) section.depth = data.depth;
	if (data.tags?.length) section.tags = data.tags;
	return section;
}
