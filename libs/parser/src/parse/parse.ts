import { type ParseContext, type ParseResult, createParseContext } from '@art-md/primitives';

import { buildDocument } from '../buildDocument/buildDocument.js';
import type { ParserConfig } from '../config/index.js';
import { createDocumentVisitContext } from '../private/index.js';

/**
 * Parses Art MD source into an `ArtDocument`.
 *
 * Takes raw markdown together with a {@link ParserConfig}. Use the second
 * overload when the caller already holds a {@link ParseContext} — markdown and
 * config are mandatory either way, and a supplied context comes first.
 *
 * The raw-markdown form builds a default parse context, opens a visit context
 * over the mdast tree, and hands both to `buildDocument`. Construct parsers are
 * instantiated from the config on every call, so a config may be reused across
 * parses.
 *
 * @param {string} markdown - Raw Art MD source to parse.
 * @param {ParserConfig} config - Construct factories driving the parse; start
 *   from `createDefaultParserConfig()` for stock behaviour.
 * @returns {ParseResult} The parsed document together with the context it was
 *   built from.
 */
export function parse(markdown: string, config: ParserConfig): ParseResult;

/**
 * Parses markdown against an explicit parse context.
 *
 * For callers that carry their own {@link ParseContext} — for example to reuse
 * a URI, or to supply construct state shared with a surrounding document.
 *
 * @param {ParseContext} context - Caller-supplied parse context.
 * @param {string} markdown - Raw Art MD source to parse.
 * @param {ParserConfig} config - Construct factories driving the parse.
 * @returns {ParseResult} The parsed document together with the context it was
 *   built from.
 */
export function parse(context: ParseContext, markdown: string, config: ParserConfig): ParseResult;

/**
 * Implementation shared by both public overloads.
 *
 * Overloads are distinguished by their first argument: a string means raw
 * markdown with a default context, anything else is a supplied context. The
 * context and config are normalised, a visit context is opened, and
 * `buildDocument` performs the walk.
 *
 * @param {string | ParseContext} markdownOrContext - Raw markdown, or a parse
 *   context when the explicit-context overload is used.
 * @param {string | ParserConfig} markdownOrConfig - Markdown, or the config when
 *   a context was supplied.
 * @param {ParserConfig} [config] - Config, only used alongside an explicit
 *   context.
 * @returns {ParseResult} The parsed document together with the context it was
 *   built from.
 */
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
