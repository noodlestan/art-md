import type { ArtDocument } from '../document/index.js';

/** Reads and writes raw markdown content at a `uri`. */
export interface ArtContentSource {
	readonly type: string;
	readonly uri: string;
	readonly maybeContent: string | undefined;
	readContent(): Promise<string>;
	writeContent(content: string): Promise<void>;
}

/** Reads and writes an `ArtDocument` at a `uri`, parsing and serializing through a codec. */
export interface ArtDocumentSource {
	readonly type: string;
	readonly uri: string;
	readonly maybeDocument: ArtDocument | undefined;
	readDocument(): Promise<ArtDocument>;
	writeDocument(doc: ArtDocument): Promise<void>;
}
