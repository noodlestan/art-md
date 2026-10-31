import {
	CONSTRUCT_PARSERS,
	CONSTRUCT_SERIALIZERS,
	DEFAULT_CONSTRUCT_PARSER,
	FACTORIES,
} from '@art-md/constructs';
import { parse } from '@art-md/parser';
import type {
	ArtCodec,
	ArtDocument,
	ConstructBase,
	ConstructFactoryEntry,
	ConstructFactoryFunction,
	ParseContext,
	ParseResult,
	SerializeContext,
	SerializeResult,
} from '@art-md/primitives';
import { serialize } from '@art-md/serializer';

import { createFactoryIndex } from './private/createFactoryIndex.js';
import { readConstructText } from './private/readConstructText.js';
import type { PartialArtCodecConfig } from './types.js';

// FACTORIES entries declare concrete parameter types, so the registry is cast once here.
const defaultConstructFactories = FACTORIES as unknown as readonly ConstructFactoryEntry[];

export function createArtCodec(config: PartialArtCodecConfig = {}): ArtCodec {
	const parserConfig = {
		defaultConstruct: config.parserConfig?.defaultConstruct ?? DEFAULT_CONSTRUCT_PARSER,
		constructs: config.parserConfig?.constructs ?? CONSTRUCT_PARSERS,
	};
	const serializerConfig = {
		constructs: config.serializerConfig?.constructs ?? CONSTRUCT_SERIALIZERS,
	};

	let factoryIndex: Map<string, ConstructFactoryFunction> | undefined;

	function getFactoryIndex(): Map<string, ConstructFactoryFunction> {
		if (factoryIndex === undefined) {
			const configuredFactories = config.factories ?? defaultConstructFactories;
			factoryIndex = createFactoryIndex(configuredFactories);
		}
		return factoryIndex;
	}

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
		getConstructFactory(name: string): ConstructFactoryFunction | undefined {
			return getFactoryIndex().get(name);
		},
		create<C extends ConstructBase = ConstructBase>(name: string, ...args: readonly unknown[]): C {
			const factory = getFactoryIndex().get(name);
			if (factory === undefined) {
				throw new TypeError(`Unknown construct name: ${name}`);
			}
			return factory(...args) as C;
		},
		toText(construct: ConstructBase): string {
			return readConstructText(construct);
		},
	};
}
