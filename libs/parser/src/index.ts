/**
 * The `@art-md/parser` public surface.
 *
 * `parse` is the main entry point; the config factory and the config type are
 * exposed so consumers can recompose the parser if needed.
 *
 * Everything else in the package is internal: the visit loop, the mdast
 * helpers, and the visit context are reachable only through these functions.
 *
 * @see `knowledge/api.md` for the entry point contract and config shape.
 */
export { createDefaultParserConfig } from './config/index.js';
export { parse } from './parse/parse.js';

export type { ParserConfig } from './config/index.js';
