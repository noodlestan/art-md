import type { FieldInline } from '../types.js';

import type { FieldInlineFactoryData } from './types.js';

export function createFieldInline(data: FieldInlineFactoryData): FieldInline {
	const field: FieldInline = {
		construct: 'FieldInline',
		name: data.name,
		children: data.children ?? [],
	};
	if (data.tags?.length) {
		field.tags = data.tags;
	}
	return field;
}
