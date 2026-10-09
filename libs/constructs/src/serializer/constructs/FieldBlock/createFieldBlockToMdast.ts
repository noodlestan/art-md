import type { Node } from 'mdast';

import type { FieldBlock } from '../../../factories/index.js';
import { tagsToMdast } from '../../tags/index.js';
import type { ConstructSerializer } from '../../types.js';

export function createFieldBlockToMdast(): ConstructSerializer {
	return {
		name: 'FieldBlock',
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		toMdast(node, _children) {
			const field = node as unknown as FieldBlock;
			const tagNode = field.tags?.length ? tagsToMdast(field.tags) : null;
			return {
				type: 'paragraph',
				children: [
					{
						type: 'strong',
						children: [{ type: 'text', value: `${field.name}:` }],
					},
					...(tagNode ? [tagNode] : []),
				],
			} as Node;
		},
	};
}
