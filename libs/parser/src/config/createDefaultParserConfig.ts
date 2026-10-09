import { CONSTRUCT_PARSERS, DEFAULT_CONSTRUCT_PARSER } from '@art-md/constructs';

import type { ParserConfig } from './types.js';

export function createDefaultParserConfig(): ParserConfig {
	return {
		defaultConstruct: DEFAULT_CONSTRUCT_PARSER,
		constructs: CONSTRUCT_PARSERS,
	};
}
