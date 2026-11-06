/**
 * The Document construct — the root record that carries a document's
 * top-level children; reach for it when you need a document to build on
 * rather than parse one.
 */
export { createDocument } from './factory/index.js';

export type { DocumentFactoryData } from './factory/index.js';
