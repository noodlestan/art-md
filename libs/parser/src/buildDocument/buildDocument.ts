import type {
	BlockContent,
	Construct,
	ConstructIntegrator,
	ConstructParser,
} from '@art-md/constructs';
import type { ArtDocument, ParserVisitContext } from '@art-md/primitives';
import type { RootContent } from 'mdast';
import type { Node } from 'unist';
import { SKIP, visit } from 'unist-util-visit';

import { isBlockType } from '../mdast/index.js';
import type { DocumentVisitContext } from '../private/index.js';

/**
 * Outcome of offering a node to a construct parser.
 *
 * Returned by `tryConstructs` and passed straight to `integrate`: a non-null
 * result means a parser claimed the node, carrying the records it built and —
 * when the parser owns integration — the integrator to run.
 *
 * `null` means no parser claimed it, so the walk falls through to block
 * classification.
 */
type HandleResult = {
	constructs: Construct[];
	integrator: ConstructIntegrator | null;
};

/**
 * Walks an mdast tree and builds the `ArtDocument` it describes.
 *
 * For every node the visit loop offers it to the configured construct parsers
 * first, in order. The first parser to claim a node integrates its record into
 * the document and the walk skips the node's subtree. Unclaimed nodes are
 * classified with `isBlockType`, and block-level leftovers are captured as
 * natural markdown by the default construct; phrasing leftovers are skipped so
 * their parent owns them.
 *
 * The context is mutated in place — constructs are appended to
 * `docContext.construct` as they are claimed — so the same object that goes in
 * comes back filled.
 *
 * @param {ConstructParser} defaultConstruct - Fallback parser consulted when no
 *   configured construct claims a node; it captures the node as natural
 *   markdown.
 * @param {ConstructParser[]} constructParsers - Ordered set of parsers offered a
 *   node before the fallback; the first to claim it wins.
 * @param {DocumentVisitContext} docContext - Visit state carrying the mdast
 *   source tree, the parse context, and the document under construction.
 * @returns {ArtDocument} The populated document, identical to
 *   `docContext.construct`.
 */
export function buildDocument(
	defaultConstruct: ConstructParser,
	constructParsers: ConstructParser[],
	docContext: DocumentVisitContext,
): ArtDocument {
	let currentContext: ParserVisitContext = docContext;

	function tryConstructs(node: RootContent): HandleResult | null {
		for (let i = 0; i < constructParsers.length; i++) {
			const constructParser = constructParsers[i] as ConstructParser;

			const processor = constructParser.processor;
			const construct = processor?.captureNode(currentContext, node);
			if (construct) {
				const integrator = constructParser.integrator ?? null;
				return {
					constructs: [construct],
					integrator,
				};
			}
		}
		return null;
	}

	function handleNaturalBlock(node: Node): typeof SKIP | undefined {
		if (!defaultConstruct.processor) {
			return SKIP;
		}

		const construct = defaultConstruct.processor.captureNode(currentContext, node) as Construct;
		currentContext = currentContext.onBeforeConstruct(construct);
		currentContext.captureChildConstruct(construct);
		return node.type === 'paragraph' ? undefined : SKIP;
	}

	function integrate(
		node: Node,
		constructs: Construct[],
		integrator: ConstructIntegrator | null,
	): void {
		for (const construct of constructs) {
			currentContext = currentContext.onBeforeConstruct(construct);

			if (integrator) {
				currentContext = integrator.integrate(currentContext, node, construct);
			} else {
				currentContext.captureChildConstruct(construct as BlockContent);
			}
		}
	}

	function visitNode(node: Node): typeof SKIP | undefined {
		if (node.type === 'root') {
			return undefined;
		}

		const result = tryConstructs(node as RootContent);
		if (result) {
			integrate(node, result.constructs, result.integrator);
			return SKIP;
		}

		if (isBlockType(node.type)) {
			return handleNaturalBlock(node);
		}

		return SKIP;
	}

	visit(docContext.source.tree, (node: Node) => visitNode(node));

	return docContext.construct;
}
