/**
 * Parser configuration module.
 *
 * Owns {@link ParserConfig} — the construct factories the parser consults — and
 * the factory that assembles the stock set. The parser core never names a
 * concrete construct; it only receives factories from here.
 *
 * Callers building a custom parser construct a `ParserConfig` literal; callers
 * wanting standard behaviour use `createDefaultParserConfig()`.
 *
 * @see `knowledge/api.md` for the config contract.
 */
export { createDefaultParserConfig } from './createDefaultParserConfig.js';

export type { ParserConfig } from './types.js';
