/**
 * Document building module.
 *
 * Owns `buildDocument`, the visit loop that assembles the `ArtDocument` from
 * an mdast tree. Not exported from the package root — `parse` is the
 * caller-facing entry point and it wires this loop up internally.
 *
 * @see `knowledge/parser.md` for the visit loop and dispatch rules.
 */
export { buildDocument } from './buildDocument.js';
