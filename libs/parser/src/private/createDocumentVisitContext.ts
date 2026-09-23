import { createArtDocumentFromNode } from '@art-md/constructs';
import { type ParseContext, createParserVisitContext } from '@art-md/primitives';
import { fromMarkdown } from 'mdast-util-from-markdown';

import type { DocumentVisitContext } from './types';

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
