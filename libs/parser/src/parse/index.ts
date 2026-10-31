/**
 * The parser entry point module.
 *
 * Owns `parse`, the public function that turns raw markdown into an
 * `ArtDocument`. Accepts either a markdown string or a pre-built
 * `ParseContext`; markdown and config are always mandatory, and a context —
 * when supplied — comes first.
 *
 * The two overloads converge on one implementation: build a visit context,
 * then hand it to `buildDocument`. Raw markdown gets a default context built
 * from {@link createDefaultParserConfig}.
 *
 * @see `knowledge/api.md` for the entry point contract, and
 *   `knowledge/parser.md` for how nodes are claimed during the walk.
 */
export { parse } from './parse.js';
