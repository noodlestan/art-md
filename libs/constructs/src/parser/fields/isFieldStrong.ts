import type { ParserVisitContext } from '@art-md/primitives';
import type { Node, Strong } from 'mdast';

import { FIELD_TEXT_PATTERN } from './constants.js';
import { stripStrong } from './stripStrong.js';

export function isFieldStrong(node: Node, context: ParserVisitContext): node is Strong {
	return node.type === 'strong' && FIELD_TEXT_PATTERN.test(stripStrong(node as Strong, context));
}
