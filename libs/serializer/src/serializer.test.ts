import type { FieldBlock, NaturalBlock, SectionBlock } from '@art-md/constructs';
import { type ArtDocument, createSerializeContext } from '@art-md/primitives';
import { describe, expect, it } from 'vitest';

import { createDefaultSerializerConfig } from './config/createDefaultSerializerConfig';
import { serialize } from './serializer';

describe('serialize', () => {
	it('throws on unknown construct', () => {
		const doc = {
			construct: 'Document',
			children: [{ construct: 'UnknownConstruct' }],
		} as unknown as ArtDocument;
		expect(() => serialize(doc, createDefaultSerializerConfig())).toThrow(
			'Unknown construct: UnknownConstruct',
		);
	});

	it('serializes a Document with nested SectionBlocks', () => {
		const doc: ArtDocument = {
			construct: 'Document',
			children: [
				{
					construct: 'SectionBlock',
					name: 'Title',
					depth: 1,
					children: [],
				} as SectionBlock,
			],
		};
		const result = serialize(doc, createDefaultSerializerConfig());
		expect(result.content).toContain('# Title');
	});

	it('serializes a Document with FieldBlocks', () => {
		const doc: ArtDocument = {
			construct: 'Document',
			children: [
				{
					construct: 'SectionBlock',
					name: 'Module',
					depth: 1,
					children: [
						{
							construct: 'FieldBlock',
							name: 'Purpose',
							children: [
								{
									construct: 'NaturalBlock',
									type: 'text',
									value: ' Test purpose',
									children: [],
								} as NaturalBlock,
							],
						} as FieldBlock,
					],
				} as SectionBlock,
			],
		};
		const result = serialize(doc, createDefaultSerializerConfig());
		expect(result.content).toContain('**Purpose:**');
		expect(result.content).toContain('Test purpose');
	});

	it('serializes a Document with NaturalBlocks', () => {
		const doc: ArtDocument = {
			construct: 'Document',
			children: [
				{
					construct: 'NaturalBlock',
					type: 'text',
					value: ' Hello world',
					children: [],
				} as NaturalBlock,
			],
		};
		const result = serialize(doc, createDefaultSerializerConfig());
		expect(result.content).toContain('Hello world');
	});

	it('serializes nested SectionBlocks without introducing extra blank lines', () => {
		const doc: ArtDocument = {
			construct: 'Document',
			children: [
				{
					construct: 'SectionBlock',
					name: 'Hello World',
					depth: 1,
					children: [
						{
							construct: 'NaturalBlock',
							type: 'text',
							value: '\n\n',
						} as NaturalBlock,
						{
							construct: 'SectionBlock',
							name: 'Details',
							depth: 2,
							children: [],
						} as SectionBlock,
					],
				} as SectionBlock,
			],
		};
		const result = serialize(doc, createDefaultSerializerConfig());

		expect(result.content).toBe('# Hello World\n\n## Details\n');
	});

	it('GIVEN a serialize context, returns it on the result', () => {
		const doc: ArtDocument = {
			construct: 'Document',
			children: [],
		};
		const context = createSerializeContext({ uri: 'file:///a.md' });

		const result = serialize(context, doc, createDefaultSerializerConfig());

		expect(result.context).toBe(context);
	});
});
