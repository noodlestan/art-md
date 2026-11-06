import type { FieldInline } from '../types.js';

import type { FieldInlineFactoryData } from './types.js';

/**
 * Builds a `FieldInline` from `data`, defaulting `children` to an empty list
 * and omitting empty `tags`.
 */
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
