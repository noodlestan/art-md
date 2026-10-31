import { CONSTRUCT_PARSERS, DEFAULT_CONSTRUCT_PARSER } from '@art-md/constructs';

import type { ParserConfig } from './types.js';

/**
 * Builds the default parser configuration.
 *
 * Wires the standard construct set from `@art-md/constructs`: the
 * natural-block parser as the {@link ParserConfig.defaultConstruct} fallback,
 * and the registered construct factories as {@link ParserConfig.constructs}.
 *
 * Use this when the caller wants stock behaviour. Callers that need a narrower
 * parser — or no fallback at all — build a {@link ParserConfig} literal instead.
 *
 * @returns {ParserConfig} A ready-to-use config carrying the default construct
 *   set.
 */
export function createDefaultParserConfig(): ParserConfig {
	return {
		defaultConstruct: DEFAULT_CONSTRUCT_PARSER,
		constructs: CONSTRUCT_PARSERS,
	};
}
