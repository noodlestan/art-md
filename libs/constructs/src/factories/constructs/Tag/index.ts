/**
 * The Tag construct — reach for it when content carries tags that belong on
 * the record rather than inside the text: a `(#name)` annotation other
 * constructs store alongside their own data.
 */
export { createTag } from './factory/index.js';

export type { Tag } from './types.js';
export type { TagFactoryData } from './factory/index.js';
