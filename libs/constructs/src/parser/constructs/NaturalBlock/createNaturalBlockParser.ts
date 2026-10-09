import type { ConstructParserFactory } from '../../types.js';

import { createNaturalBlockProcessor } from './private/index.js';

export const createNaturalBlockParser: ConstructParserFactory = () => ({
	name: 'NaturalBlock',
	processor: createNaturalBlockProcessor(),
});
