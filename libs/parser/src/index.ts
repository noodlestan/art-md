/**
 * The `@art-md/parser` public surface.
 *
 * Re-exports the entry point, its config factory, and the config type — the
 * three names a caller needs to turn markdown into an `ArtDocument`.
 *
 * Everything else in the package is internal: the visit loop, the mdast
 * helpers, and the visit context are reachable only through these functions.
 *
 * @see `knowledge/api.md` for the entry point contract and config shape.
 */
export { createDefaultParserConfig } from './config/index.js';
export { parse } from './parse/parse.js';

export type { ParserConfig } from './config/index.js';
