import type { FieldInline, NaturalBlock, SectionBlock } from '@art-md/constructs';
import type { ConstructBase } from '@art-md/primitives';
import { createParseContext, createSerializeContext } from '@art-md/primitives';
import { describe, expect, it } from 'vitest';

import { createArtCodec } from './createArtCodec.js';

describe('createArtCodec', () => {
	it('WHEN parsing raw markdown returns a ParseResult', () => {
		const codec = createArtCodec();

		const result = codec.parse('# Hello');

		expect(result.document.construct).toBe('Document');
		expect(result.document.children).toHaveLength(1);
	});

	it('GIVEN a parse context, returns it on the result', () => {
		const codec = createArtCodec();
		const context = createParseContext({ uri: 'file:///a.md' });

		const result = codec.parse(context, '# Hello');

		expect(result.context).toBe(context);
	});

	it('WHEN serializing a document returns a SerializeResult', () => {
		const codec = createArtCodec();

		const result = codec.serialize({
			construct: 'Document',
			children: [
				{ construct: 'SectionBlock', name: 'Title', depth: 1, children: [] } as SectionBlock,
			],
		});

		expect(result.content).toContain('# Title');
	});

	it('GIVEN a serialize context, returns it on the result', () => {
		const codec = createArtCodec();
		const context = createSerializeContext({ uri: 'file:///a.md' });

		const result = codec.serialize(context, {
			construct: 'Document',
			children: [
				{ construct: 'SectionBlock', name: 'Title', depth: 1, children: [] } as SectionBlock,
			],
		});

		expect(result.context).toBe(context);
	});

	it('FOR the default registry resolves an ordinary construct factory', () => {
		const codec = createArtCodec();

		const factory = codec.getConstructFactory('SectionBlock');

		expect(factory).toBeTypeOf('function');
	});

	it('FOR the default registry returns undefined for Document and unknown names', () => {
		const codec = createArtCodec();

		const documentFactory = codec.getConstructFactory('Document');
		const unknownFactory = codec.getConstructFactory('UnknownConstruct');

		expect(documentFactory).toBeUndefined();
		expect(unknownFactory).toBeUndefined();
	});

	it('WHEN creating a NaturalBlock returns it carrying the value and children passed', () => {
		const codec = createArtCodec();

		const block = codec.create<NaturalBlock>('NaturalBlock', { value: 'body', children: [] });

		expect(block.construct).toBe('NaturalBlock');
		expect(block.value).toBe('body');
		expect(block.children).toEqual([]);
	});

	it('WHEN creating a FieldInline returns it carrying the name passed', () => {
		const codec = createArtCodec();

		const field = codec.create<FieldInline>('FieldInline', { name: 'title' });

		expect(field.construct).toBe('FieldInline');
		expect(field.name).toBe('title');
	});

	it('WHEN creating Document throws the same TypeError as an unknown construct name', () => {
		const codec = createArtCodec();

		expect(() => codec.create('Document')).toThrow(TypeError);
		expect(() => codec.create('Document')).toThrow('Unknown construct name: Document');
		expect(() => codec.create('UnknownConstruct')).toThrow(TypeError);
		expect(() => codec.create('UnknownConstruct')).toThrow(
			'Unknown construct name: UnknownConstruct',
		);
	});

	it('GIVEN configured factories, creates a construct registered under a foreign name', () => {
		const codec = createArtCodec({
			factories: [
				{
					name: 'OtherPackageBlock',
					factory: (payload: unknown): ConstructBase => {
						return { construct: 'OtherPackageBlock', payload } as ConstructBase;
					},
				},
			],
		});

		const block = codec.create('OtherPackageBlock', 'payload');

		expect(block.construct).toBe('OtherPackageBlock');
	});

	it('GIVEN configured factories, no longer resolves the default construct names', () => {
		const codec = createArtCodec({
			factories: [
				{
					name: 'OtherPackageBlock',
					factory: (): ConstructBase => {
						return { construct: 'OtherPackageBlock' } as ConstructBase;
					},
				},
			],
		});

		const defaultFactory = codec.getConstructFactory('SectionBlock');

		expect(defaultFactory).toBeUndefined();
		expect(() => codec.create('SectionBlock')).toThrow('Unknown construct name: SectionBlock');
	});

	it('WHEN reading text from a construct with a value returns the value', () => {
		const codec = createArtCodec();
		const construct = { construct: 'NaturalBlock', value: 'plain text' } as ConstructBase;

		const text = codec.toText(construct);

		expect(text).toBe('plain text');
	});

	it('WHEN reading text from nested children joins them in order', () => {
		const codec = createArtCodec();
		const construct = {
			construct: 'SectionBlock',
			children: [
				{ construct: 'NaturalBlock', value: 'first' },
				{ construct: 'SectionBlock', children: [{ construct: 'NaturalBlock', value: 'second' }] },
				{ construct: 'NaturalBlock', value: 'third' },
			],
		} as ConstructBase;

		const text = codec.toText(construct);

		expect(text).toBe('firstsecondthird');
	});

	it('WHEN reading text from a construct with neither value nor children returns an empty string', () => {
		const codec = createArtCodec();
		const construct = { construct: 'Empty' };

		const text = codec.toText(construct);

		expect(text).toBe('');
	});

	it('GIVEN repeated lookups of the same name returns the same factory reference', () => {
		const codec = createArtCodec();

		const firstFactory = codec.getConstructFactory('SectionBlock');
		const secondFactory = codec.getConstructFactory('SectionBlock');

		expect(firstFactory).toBe(secondFactory);
	});
});
