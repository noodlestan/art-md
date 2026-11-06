import type { FieldBlock } from '../types.js';

import type { FieldBlockFactoryData } from './types.js';

/**
 * Builds a `FieldBlock` from `data`, defaulting `children` to an empty list
 * and omitting empty `tags`.
 */
export function createFieldBlock(data: FieldBlockFactoryData): FieldBlock {
	const field: FieldBlock = {
		construct: 'FieldBlock',
		name: data.name,
		children: data.children ?? [],
	};
	if (data.tags?.length) {
		field.tags = data.tags;
	}
	return field;
}
