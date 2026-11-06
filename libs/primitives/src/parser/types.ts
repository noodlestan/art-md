import type {
	BlockContent,
	DefinitionContent,
	ListContent,
	Node,
	PhrasingContent,
	RootContent,
	RowContent,
	TableContent,
} from 'mdast';

import type { ArtDocument } from '../document/index.js';

import type { ParseContext } from './context/index.js';

/** The child node union mdast exposes to `MdastNode`. */
type ChildNode =
	| RootContent
	| BlockContent
	| PhrasingContent
	| ListContent
	| DefinitionContent
	| TableContent
	| RowContent;

/** An mdast node as the parser sees it: children and value made optional. */
export type MdastNode = Node & {
	children?: ChildNode[];
	value?: string;
};

/** A point in the source. */
export type Point = {
	line: number;
	column: number;
	offset: number;
};

/** The source span of a record. */
export type Position = {
	start: Point;
	end: Point;
};

/** The `ArtDocument` a parse produced, paired with the `ParseContext` it was built from. */
export interface ParseResult {
	document: ArtDocument;
	context: ParseContext;
}
