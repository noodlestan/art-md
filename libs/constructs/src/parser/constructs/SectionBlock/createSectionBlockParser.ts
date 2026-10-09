import type { ConstructParserFactory } from '../../types.js';

import { createSectionBlockIntegrator, createSectionBlockProcessor } from './private/index.js';

export const createSectionBlockParser: ConstructParserFactory = () => ({
	name: 'SectionBlock',
	processor: createSectionBlockProcessor(),
	integrator: createSectionBlockIntegrator(),
});
