import type { ConstructParserFactory } from '../../types.js';

import { createFieldBlockIntegrator, createFieldBlockProcessor } from './private/index.js';

/**
 * Creates the `FieldBlock` parser: a processor that captures label
 * paragraphs, paired with an integrator that nests them.
 */
export const createFieldBlockParser: ConstructParserFactory = () => ({
	name: 'FieldBlock',
	processor: createFieldBlockProcessor(),
	integrator: createFieldBlockIntegrator(),
});
