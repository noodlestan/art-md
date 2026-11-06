import type { Root } from 'mdast';

import type { ConstructBase, ContainerConstructBase } from '../../constructs/index.js';

/** Hook that runs before a construct is visited and returns the adjusted visit context. */
export type OnBeforeConstruct = (
	construct: ConstructBase,
	context: ParserVisitContext,
) => ParserVisitContext;

/** The mdast tree and raw markdown a visit walks. */
export type ParserSource = {
	readonly tree: Root;
	readonly markdown: string;
};

/** Carries the construct under visit with its source, child capture, and descent hooks. */
export type ParserVisitContext = {
	readonly construct: ConstructBase;
	readonly source: ParserSource;
	readonly parseContext: ParseContext;
	captureChildConstruct(child: ConstructBase): void;
	onBeforeConstruct(construct: ConstructBase): ParserVisitContext;
	childContext(
		construct: ContainerConstructBase,
		onBeforeConstruct?: OnBeforeConstruct,
	): ParserVisitContext;
	parent(): ParserVisitContext | undefined;
};

/** The data a parse context is built from: the document `uri`. */
export type ParserContextData = {
	uri: string;
};

/** Identifies the document being parsed by its `uri`. */
export type ParseContext = {
	uri: string;
};
