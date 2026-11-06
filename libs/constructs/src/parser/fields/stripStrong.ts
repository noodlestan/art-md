import type { ParserVisitContext } from '@art-md/primitives';
import type { Strong } from 'mdast';

import { rawSlice } from '../mdast/index.js';

/**
 * Returns a strong node's inner text, dropping the `**` or `__` markers
 * when the source slice carries them.
 */
export function stripStrong(node: Strong, context: ParserVisitContext): string {
	const raw = rawSlice(node, context);
	return raw.length >= 4 &&
		((raw.startsWith('**') && raw.endsWith('**')) || (raw.startsWith('__') && raw.endsWith('__')))
		? raw.slice(2, -2)
		: raw;
}
