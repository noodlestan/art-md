import type { ArtDocument } from '../document/index.js';
import type { ParseContext } from '../parser/context/types.js';
import type { ParseResult } from '../parser/types.js';
import type { SerializeContext } from '../serializer/context/types.js';
import type { SerializeResult } from '../serializer/types.js';

export interface ArtCodec {
	parse(markdown: string): ParseResult;
	parse(context: ParseContext, markdown: string): ParseResult;
	serialize(document: ArtDocument): SerializeResult;
	serialize(context: SerializeContext, document: ArtDocument): SerializeResult;
}
