import type { ConstructBase } from '../constructs/index.js';
import type { ArtDocument } from '../document/index.js';
import type { ParseContext } from '../parser/context/types.js';
import type { ParseResult } from '../parser/types.js';
import type { SerializeContext } from '../serializer/context/types.js';
import type { SerializeResult } from '../serializer/types.js';

export type ConstructFactoryFunction = (...args: readonly unknown[]) => ConstructBase;

export type ConstructFactoryEntry = {
	readonly name: string;
	readonly factory: ConstructFactoryFunction;
};

export interface ArtCodec {
	parse(markdown: string): ParseResult;
	parse(context: ParseContext, markdown: string): ParseResult;
	serialize(document: ArtDocument): SerializeResult;
	serialize(context: SerializeContext, document: ArtDocument): SerializeResult;
	getConstructFactory(name: string): ConstructFactoryFunction | undefined;
	create<C extends ConstructBase = ConstructBase>(name: string, ...args: readonly unknown[]): C;
	toText(construct: ConstructBase): string;
}
