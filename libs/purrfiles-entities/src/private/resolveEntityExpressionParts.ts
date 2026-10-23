import { ENTITY_TYPES } from '../constants.js';

import type { ResolvedExpression } from './types.js';

/**
 * Parses a link expression string into its parts: pkg, type and name.
 *
 * Link expression pattern: `[pkg:][type:]name`
 *
 * Rules:
 * - One segment yields `{ name }`.
 * - Two segments: if the first is a known entity type yields `{ type, name }`, otherwise `{ pkg, name }`.
 * - Three or more segments yields `{ pkg, type, name }`.
 *
 * Any text beyond the third `:` segment is stripped away.
 */
export const resolveEntityExpressionParts = (text: string): ResolvedExpression => {
	const parts = text.split(':');

	if (parts.length === 1) {
		return {
			name: text,
		};
	}

	const first = parts[0] as string;

	if (parts.length === 2) {
		if (ENTITY_TYPES.includes(first)) {
			return {
				type: first,
				name: parts[1] as string,
			};
		}

		return {
			pkg: first,
			name: parts[1] as string,
		};
	}

	return {
		pkg: parts[0],
		type: parts[1],
		name: parts[2] as string,
	};
};
