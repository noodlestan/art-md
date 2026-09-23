import {
	CONSTRUCT_PARSERS,
	CONSTRUCT_SERIALIZERS,
	DEFAULT_CONSTRUCT_PARSER,
} from '@art-md/constructs';
import { parse } from '@art-md/parser';
import type {
	ArtCodec,
	ArtDocument,
	ParseContext,
	ParseResult,
	SerializeContext,
	SerializeResult,
} from '@art-md/primitives';
import { serialize } from '@art-md/serializer';

import type { PartialArtCodecConfig } from './types';

export function createArtCodec(config: PartialArtCodecConfig = {}): ArtCodec {
	const parserConfig = {
		defaultConstruct: config.parserConfig?.defaultConstruct ?? DEFAULT_CONSTRUCT_PARSER,
		constructs: config.parserConfig?.constructs ?? CONSTRUCT_PARSERS,
	};
	const serializerConfig = {
		constructs: config.serializerConfig?.constructs ?? CONSTRUCT_SERIALIZERS,
	};

	return {
		parse(markdownOrContext: string | ParseContext, markdown?: string): ParseResult {
			if (typeof markdownOrContext === 'string') {
				return parse(markdownOrContext, parserConfig);
			}
			return parse(markdownOrContext, markdown as string, parserConfig);
		},
		serialize(
			documentOrContext: ArtDocument | SerializeContext,
			document?: ArtDocument,
		): SerializeResult {
			if ('uri' in documentOrContext) {
				return serialize(
					documentOrContext as SerializeContext,
					document as ArtDocument,
					serializerConfig,
				);
			}
			return serialize(documentOrContext as ArtDocument, serializerConfig);
		},
	};
}
