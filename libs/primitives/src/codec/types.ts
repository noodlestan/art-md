import type { ArtDocument } from '../document';
import type { ParseContext } from '../parser/context/types';
import type { ParseResult } from '../parser/types';
import type { SerializeContext } from '../serializer/context/types';
import type { SerializeResult } from '../serializer/types';

export interface ArtCodec {
	parse(markdown: string): ParseResult;
	parse(context: ParseContext, markdown: string): ParseResult;
	serialize(document: ArtDocument): SerializeResult;
	serialize(context: SerializeContext, document: ArtDocument): SerializeResult;
}
