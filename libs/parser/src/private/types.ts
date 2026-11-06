import type { ArtDocument, ParserVisitContext } from '@art-md/primitives';

/**
 * Mutable visit state threaded through the document build.
 *
 * Extends the public
 * {@link @art-md/primitives:context#ParserVisitContext} with the
 * {@link @art-md/primitives:document#ArtDocument} currently being assembled, so
 * construct parsers can append to the document without receiving it as an
 * argument.
 *
 * Not exported from the package root: it exists to carry state across the visit
 * loop in `buildDocument`, and callers work with a `ParseResult` instead.
 */
export type DocumentVisitContext = ParserVisitContext & {
	/** The document under construction; mutated in place as nodes are claimed. */
	construct: ArtDocument;
};
