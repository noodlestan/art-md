import type { ConstructParserFactory } from '@art-md/constructs';

/**
 * Configuration accepted by the parser entry point.
 *
 * The parser core stays construct-agnostic: it never names a concrete construct
 * type and drives detection entirely through the contract types from
 * `@art-md/constructs`. This config only supplies the factories that do the
 * recognising.
 */
export type ParserConfig = {
	/**
	 * Fallback factory used when no construct claims a node.
	 *
	 * Typically `createNaturalBlockParser`, which treats unrecognised content as
	 * natural markdown rather than failing the parse.
	 */
	defaultConstruct: ConstructParserFactory;

	/**
	 * Ordered list of construct factories consulted during parsing.
	 *
	 * Each factory produces a `ConstructParser` instance, and they are consulted
	 * in array order. The first construct to claim a node wins.
	 */
	constructs: ConstructParserFactory[];
};
