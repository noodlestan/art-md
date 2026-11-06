/**
 * The parser entry point module.
 *
 * Owns `parse` — the main entry point: reach for it to turn raw markdown into
 * an `ArtDocument`. Its default context comes from
 * {@link config#createDefaultParserConfig}.
 *
 * @see `knowledge/api.md` for the entry point contract, and
 *   `knowledge/parser.md` for how nodes are claimed during the walk.
 */
export { parse } from './parse.js';
