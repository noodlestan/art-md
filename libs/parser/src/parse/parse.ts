import { type ParseContext, type ParseResult, createParseContext } from '@art-md/primitives';

import { buildDocument } from '../buildDocument/buildDocument';
import type { ParserConfig } from '../config';
import { createDocumentVisitContext } from '../private';

export function parse(markdown: string, config: ParserConfig): ParseResult;
export function parse(context: ParseContext, markdown: string, config: ParserConfig): ParseResult;
export function parse(
	markdownOrContext: string | ParseContext,
	markdownOrConfig: string | ParserConfig,
	config?: ParserConfig,
): ParseResult {
	const hasContext = typeof markdownOrContext !== 'string';
	const markdown = hasContext ? (markdownOrConfig as string) : markdownOrContext;
	const resolvedConfig = hasContext ? (config as ParserConfig) : (markdownOrConfig as ParserConfig);
	const context = hasContext
		? (markdownOrContext as ParseContext)
		: createParseContext({ uri: '' });

	const docContext = createDocumentVisitContext(markdown, context);
	const defaultConstruct = resolvedConfig.defaultConstruct();
	const constructParsers = resolvedConfig.constructs.map(create => create());

	const document = buildDocument(defaultConstruct, constructParsers, docContext);
	return { document, context };
}
