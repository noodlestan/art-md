import type { ParseContext, ParserContextData } from './types.js';

/** Builds a `ParseContext` from its data — currently just the source `uri`. */
export function createParseContext(data: ParserContextData): ParseContext {
	return { uri: data.uri };
}
