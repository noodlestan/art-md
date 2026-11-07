import type { ParserConfig } from '@art-md/parser';
import type { ConstructFactoryEntry } from '@art-md/primitives';
import type { SerializerConfig } from '@art-md/serializer';

/** The codec's full configuration — a {@link @art-md/parser:config#ParserConfig}, a {@link @art-md/serializer:config#SerializerConfig}, and the construct factory entries. */
export type ArtCodecConfig = {
	parserConfig: ParserConfig;
	serializerConfig: SerializerConfig;
	factories: readonly ConstructFactoryEntry[];
};

/** A partial codec config; every omitted field falls back to the defaults from `@art-md/constructs`. */
export type PartialArtCodecConfig = {
	parserConfig?: Partial<ParserConfig>;
	serializerConfig?: Partial<SerializerConfig>;
	factories?: readonly ConstructFactoryEntry[];
};
