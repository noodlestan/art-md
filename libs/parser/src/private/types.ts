import type { ArtDocument, ParserVisitContext } from '@art-md/primitives';

export type DocumentVisitContext = ParserVisitContext & {
	construct: ArtDocument;
};
