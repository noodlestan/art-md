import type { ParseContext, ParserContextData } from './types.js';

export function createParseContext(data: ParserContextData): ParseContext {
	return { uri: data.uri };
}
