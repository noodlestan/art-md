import type { ConstructParserFactory } from '../../types.js';

import { createFieldBlockIntegrator, createFieldBlockProcessor } from './private/index.js';

export const createFieldBlockParser: ConstructParserFactory = () => ({
	name: 'FieldBlock',
	processor: createFieldBlockProcessor(),
	integrator: createFieldBlockIntegrator(),
});
