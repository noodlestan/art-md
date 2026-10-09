import type { ConstructParserFactory } from '../../types.js';

import { createFieldInlineProcessor } from './private/index.js';

export const createFieldInlineParser: ConstructParserFactory = () => ({
	name: 'FieldInline',
	processor: createFieldInlineProcessor(),
});
