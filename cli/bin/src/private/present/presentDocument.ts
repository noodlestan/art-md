import type { ArtDocument } from '@art-md/primitives';

import { makeDocumentOutline } from './private/makeDocumentOutline';
import { JSON_INDENT, type PresentOptions } from './types';

export function presentDocument(document: ArtDocument, options: PresentOptions): string {
	if (options.json === true) {
		return JSON.stringify(document, null, JSON_INDENT);
	}
	const outline = makeDocumentOutline(document);
	return outline.join('\n');
}
