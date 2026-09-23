import type { ParserConfig } from '@art-md/parser';
import type { SerializerConfig } from '@art-md/serializer';

export type ArtCodecConfig = {
	parserConfig: ParserConfig;
	serializerConfig: SerializerConfig;
};

export type PartialArtCodecConfig = {
	parserConfig?: Partial<ParserConfig>;
	serializerConfig?: Partial<SerializerConfig>;
};
