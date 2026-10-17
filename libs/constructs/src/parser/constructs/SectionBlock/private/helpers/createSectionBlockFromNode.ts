import { nodePosition } from '@art-md/primitives';
import type { ParserVisitContext } from '@art-md/primitives';
import type { Heading } from 'mdast';

import { type SectionBlock, createSectionBlock } from '../../../../../factories/index.js';
import { rawSlice } from '../../../../mdast/index.js';
import { extractTags } from '../../../../tags/index.js';

export function createSectionBlockFromNode(
	node: Heading,
	context: ParserVisitContext,
): SectionBlock {
	const text = rawSlice(node, context)
		.replace(/^[ \t]*#+[ \t]*/, '')
		.trim();
	const { tags, stripped } = extractTags(text);
	const section = createSectionBlock({
		name: stripped,
		depth: node.depth,
		children: [],
		tags,
	});
	section.position = nodePosition(node);
	return section;
}
