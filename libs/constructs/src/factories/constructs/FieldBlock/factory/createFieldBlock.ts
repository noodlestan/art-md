import type { FieldBlock } from '../types.js';

import type { FieldBlockFactoryData } from './types.js';

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
