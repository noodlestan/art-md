import { createFieldBlockParser } from './constructs/FieldBlock/index.js';
import { createFieldInlineParser } from './constructs/FieldInline/index.js';
import { createNaturalBlockParser } from './constructs/NaturalBlock/index.js';
import { createSectionBlockParser } from './constructs/SectionBlock/index.js';
import type { ConstructParserFactory } from './types.js';

export { createArtDocumentFromNode } from './document/createArtDocumentFromNode.js';

export const CONSTRUCT_PARSERS: ConstructParserFactory[] = [
	createFieldBlockParser,
	createFieldInlineParser,
	createSectionBlockParser,
];
export const DEFAULT_CONSTRUCT_PARSER = createNaturalBlockParser;

export type * from './types.js';
