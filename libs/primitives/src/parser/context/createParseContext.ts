import type { ParseContext, ParserContextData } from './types';

export function createParseContext(data: ParserContextData): ParseContext {
	return { uri: data.uri };
}
