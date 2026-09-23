import type { ArtDocument } from '../document';

export interface ArtContentSource {
	readonly type: string;
	readonly uri: string;
	readonly maybeContent: string | undefined;
	readContent(): Promise<string>;
	writeContent(content: string): Promise<void>;
}

export interface ArtDocumentSource {
	readonly type: string;
	readonly uri: string;
	readonly maybeDocument: ArtDocument | undefined;
	readDocument(): Promise<ArtDocument>;
	writeDocument(doc: ArtDocument): Promise<void>;
}
