import type { ParserConfig } from '@art-md/parser';
import type { ConstructFactoryEntry } from '@art-md/primitives';
import type { SerializerConfig } from '@art-md/serializer';

export type ArtCodecConfig = {
	parserConfig: ParserConfig;
	serializerConfig: SerializerConfig;
	factories: readonly ConstructFactoryEntry[];
};

export type PartialArtCodecConfig = {
	parserConfig?: Partial<ParserConfig>;
	serializerConfig?: Partial<SerializerConfig>;
	factories?: readonly ConstructFactoryEntry[];
};
