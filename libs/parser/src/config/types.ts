import type { ConstructParserFactory } from '@art-md/constructs';

/**
 * Configuration accepted by the parser entry point.
 *
 * Drives detection entirely through the contract types from
 * `@art-md/constructs`: this config only supplies the factories that do the
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
