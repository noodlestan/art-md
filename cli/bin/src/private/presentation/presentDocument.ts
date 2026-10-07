import type { ArtDocument } from '@art-md/primitives';

import { JSON_INDENT } from './constants';

export function presentDocument(document: ArtDocument): string {
	return JSON.stringify(document, null, JSON_INDENT);
}
