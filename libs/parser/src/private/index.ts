/**
 * Internal visit-context wiring.
 *
 * Holds the mutable context carried through the document build, and the helper
 * that parses markdown and opens it. Not part of the package's public surface —
 * only `parse` and `buildDocument` depend on it.
 *
 * Nothing here is re-exported from the package root.
 */
export { createDocumentVisitContext } from './createDocumentVisitContext.js';

export type * from './types.js';
