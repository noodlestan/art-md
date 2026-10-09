import type { FieldBlock } from './constructs/FieldBlock/index.js';
import type { FieldInline } from './constructs/FieldInline/index.js';
import type { NaturalBlock } from './constructs/NaturalBlock/index.js';
import type { NaturalExpression } from './constructs/NaturalExpression/index.js';
import type { SectionBlock } from './constructs/SectionBlock/index.js';
import type { Tag } from './constructs/Tag/index.js';

/**
 * Open registry of block-level constructs. Augment via declaration merging when new constructs land.
 *
 * @conventions-ignore Conventions: Typescript / Types / No Interface
 */
export interface BlockConstructMap {
	SectionBlock: SectionBlock;
	FieldBlock: FieldBlock;
	FieldInline: FieldInline;
	NaturalBlock: NaturalBlock;
}

/**
 * Open registry of inline/expression-level constructs. Augment via declaration merging when new constructs land.
 *
 * @conventions-ignore Conventions: Typescript / Types / No Interface
 */
export interface InlineConstructMap {
	NaturalExpression: NaturalExpression;
	Tag: Tag;
}

/** Open registry of all constructs. */
export type ConstructMap = BlockConstructMap & InlineConstructMap;

export type BlockContent = BlockConstructMap[keyof BlockConstructMap];
export type InlineContent = InlineConstructMap[keyof InlineConstructMap];

export type Construct = ConstructMap[keyof ConstructMap];
