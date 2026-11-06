import type { ConstructParserFactory } from '../../types.js';

import { createNaturalBlockProcessor } from './private/index.js';

/** Creates the `NaturalBlock` parser: a processor that captures unclaimed block content. */
export const createNaturalBlockParser: ConstructParserFactory = () => ({
	name: 'NaturalBlock',
	processor: createNaturalBlockProcessor(),
});
