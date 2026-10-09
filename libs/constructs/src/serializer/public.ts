import { createDocumentToMdast } from './constructs/Document/index.js';
import { createFieldBlockToMdast } from './constructs/FieldBlock/index.js';
import { createFieldInlineToMdast } from './constructs/FieldInline/index.js';
import { createNaturalBlockToMdast } from './constructs/NaturalBlock/index.js';
import { createNaturalExpressionToMdast } from './constructs/NaturalExpression/index.js';
import { createSectionBlockToMdast } from './constructs/SectionBlock/index.js';
import type { ConstructSerializerFactory } from './types.js';

export const CONSTRUCT_SERIALIZERS: ConstructSerializerFactory[] = [
	createDocumentToMdast,
	createFieldBlockToMdast,
	createFieldInlineToMdast,
	createNaturalBlockToMdast,
	createNaturalExpressionToMdast,
	createSectionBlockToMdast,
];

export type * from './types.js';
