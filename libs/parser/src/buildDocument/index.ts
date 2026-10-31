/**
 * Document building module.
 *
 * Owns `buildDocument`, the visit loop that walks an mdast tree and assembles
 * the `ArtDocument`. For each node it offers the configured construct parsers a
 * claim first, then falls back to classifying the node as block or phrasing
 * content.
 *
 * Not exported from the package root — `parse` is the caller-facing entry point
 * and it wires this loop up internally.
 *
 * @see `knowledge/parser.md` for the visit loop and dispatch rules.
 */
export { buildDocument } from './buildDocument.js';
