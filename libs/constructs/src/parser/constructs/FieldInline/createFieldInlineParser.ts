import type { ConstructParserFactory } from '../../types.js';

import { createFieldInlineProcessor } from './private/index.js';

/**
 * Creates the `FieldInline` parser: a processor that captures inline label
 * paragraphs, with no integrator.
 */
export const createFieldInlineParser: ConstructParserFactory = () => ({
	name: 'FieldInline',
	processor: createFieldInlineProcessor(),
});
