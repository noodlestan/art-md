import { createDocument } from './constructs/Document/index.js';
import { createFieldBlock } from './constructs/FieldBlock/index.js';
import { createFieldInline } from './constructs/FieldInline/index.js';
import { createNaturalBlock } from './constructs/NaturalBlock/index.js';
import { createNaturalExpression } from './constructs/NaturalExpression/index.js';
import { createSectionBlock } from './constructs/SectionBlock/index.js';
import { createTag } from './constructs/Tag/index.js';

export type { FieldBlock } from './constructs/FieldBlock/index.js';
export type { FieldInline } from './constructs/FieldInline/index.js';
export type { NaturalBlock } from './constructs/NaturalBlock/index.js';
export type { NaturalExpression } from './constructs/NaturalExpression/index.js';
export type { SectionBlock } from './constructs/SectionBlock/index.js';
export type { Tag } from './constructs/Tag/index.js';

export type * from './types.js';

export const FACTORIES = [
	{
		name: 'Document',
		factory: createDocument,
	},
	{
		name: 'FieldBlock',
		factory: createFieldBlock,
	},
	{
		name: 'FieldInline',
		factory: createFieldInline,
	},
	{
		name: 'NaturalBlock',
		factory: createNaturalBlock,
	},
	{
		name: 'NaturalExpression',
		factory: createNaturalExpression,
	},
	{
		name: 'SectionBlock',
		factory: createSectionBlock,
	},
	{
		name: 'Tag',
		factory: createTag,
	},
];
