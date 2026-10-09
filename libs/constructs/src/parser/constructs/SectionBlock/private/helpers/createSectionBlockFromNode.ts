import { nodePosition } from '@art-md/primitives';
import type { ParserVisitContext } from '@art-md/primitives';
import type { Heading } from 'mdast';

import { type SectionBlock, createSectionBlock } from '../../../../../factories/index.js';
import { rawSlice } from '../../../../mdast/index.js';
import { extractTags } from '../../../../tags/index.js';
import { KIND_PATTERN } from '../constants.js';

export function createSectionBlockFromNode(
	node: Heading,
	context: ParserVisitContext,
): SectionBlock {
	const text = rawSlice(node, context)
		.replace(/^[ \t]*#+[ \t]*/, '')
		.trim();
	const { tags, stripped } = extractTags(text);
	const kindMatch = stripped.match(KIND_PATTERN);
	const section = createSectionBlock({
		name: kindMatch?.[2]?.trim() ?? stripped,
		kind: kindMatch?.[1],
		depth: node.depth,
		children: [],
		tags,
	});
	section.position = nodePosition(node);
	return section;
}
