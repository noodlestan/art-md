import type { ArtDocument } from '@art-md/primitives';

import { JSON_INDENT } from './types';

export function presentDocument(document: ArtDocument): string {
	return JSON.stringify(document, null, JSON_INDENT);
}
