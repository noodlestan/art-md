/**
 * Parser configuration module.
 *
 * Owns {@link config#ParserConfig} — the construct factories the parser consults — and
 * `createDefaultParserConfig()`, the factory that assembles the stock set:
 * callers wanting standard behaviour use the factory, callers building a
 * custom parser construct a literal. The parser core never names a concrete
 * construct; it only receives factories from here.
 *
 * @see `knowledge/api.md` for the config contract.
 */
export { createDefaultParserConfig } from './createDefaultParserConfig.js';

export type { ParserConfig } from './types.js';
