/**
 * The SectionBlock construct — reach for it when markdown nests content
 * under a `# heading`: a heading with optional depth, children, and tags.
 */
export { createSectionBlock } from './factory/index.js';

export type { SectionBlock } from './types.js';
export type { SectionBlockFactoryData } from './factory/index.js';
