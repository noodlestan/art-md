import type { ConstructParserFactory } from '../../types.js';

import { createSectionBlockIntegrator, createSectionBlockProcessor } from './private/index.js';

/**
 * Creates the `SectionBlock` parser: a processor that captures headings,
 * paired with an integrator that nests content under them.
 */
export const createSectionBlockParser: ConstructParserFactory = () => ({
	name: 'SectionBlock',
	processor: createSectionBlockProcessor(),
	integrator: createSectionBlockIntegrator(),
});
