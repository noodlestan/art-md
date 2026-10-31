import { createArtDocumentFromNode } from '@art-md/constructs';
import { type ParseContext, createParserVisitContext } from '@art-md/primitives';
import { fromMarkdown } from 'mdast-util-from-markdown';

import type { DocumentVisitContext } from './types.js';

/**
 * Parses markdown and opens a visit context over the resulting tree.
 *
 * Runs `fromMarkdown`, wraps the mdast root as an empty `ArtDocument`, then
 * attaches the parse context, the source tree, and the raw markdown so that
 * construct parsers can read where they came from.
 *
 * This is the bridge between the caller-supplied {@link ParseContext} and the
 * mutable {@link DocumentVisitContext} that `buildDocument` walks. It is
 * internal — `parse` owns the call.
 *
 * @param {string} markdown - Raw Art MD source to parse into an mdast tree.
 * @param {ParseContext} parseContext - Supplies construct configuration and
 *   any caller-supplied overrides.
 * @returns {DocumentVisitContext} A context whose `construct` is the empty
 *   document ready to be filled by the visit loop.
 */
export function createDocumentVisitContext(
	markdown: string,
	parseContext: ParseContext,
): DocumentVisitContext {
	const tree = fromMarkdown(markdown);
	const document = createArtDocumentFromNode(tree);

	const source = {
		tree,
		markdown,
	};

	return createParserVisitContext(document, source, parseContext) as DocumentVisitContext;
}
