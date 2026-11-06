/**
 * The NaturalBlock construct — reach for it when markdown carries no
 * construct of its own: free-form block content such as paragraphs and code
 * blocks, with optional tags.
 */
export { createNaturalBlock } from './factory/index.js';

export type { NaturalBlock } from './types.js';
export type { NaturalBlockFactoryData } from './factory/index.js';
