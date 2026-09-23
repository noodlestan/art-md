import { createParseContext } from '@art-md/primitives';
import { describe, expect, it } from 'vitest';

import { createDefaultConfig } from '../config';

import { parse } from './parse';

describe('parse', () => {
	it('WHEN called with an empty string returns a Document', () => {
		const result = parse('', createDefaultConfig());

		expect(result.document.construct).toBe('Document');
		expect(result.document.children).toEqual([]);
	});

	it('WHEN parsing a heading into a SectionBlock', () => {
		const result = parse('# Hello', createDefaultConfig());

		expect(result.document.construct).toBe('Document');
		expect(result.document.children).toHaveLength(1);
		expect(result.document.children[0]).toMatchObject({
			construct: 'SectionBlock',
			name: 'Hello',
			depth: 1,
		});
	});

	it('WHEN parsing a paragraph into a NaturalBlock', () => {
		const result = parse('Hello world', createDefaultConfig());

		expect(result.document.construct).toBe('Document');
		expect(result.document.children).toHaveLength(1);
		expect(result.document.children[0]).toMatchObject({
			construct: 'NaturalBlock',
			value: 'Hello world',
		});
	});

	it('WHEN parsing a field inline value into a FieldInline', () => {
		const result = parse('**Greeting:** Hello world', createDefaultConfig());

		expect(result.document.construct).toBe('Document');
		expect(result.document.children).toHaveLength(1);
		expect(result.document.children[0]).toMatchObject({
			construct: 'FieldInline',
			name: 'Greeting',
		});
	});

	it('WHEN parsing a field block into a FieldBlock', () => {
		const result = parse('**Purpose:**', createDefaultConfig());

		expect(result.document.construct).toBe('Document');
		expect(result.document.children).toHaveLength(1);
		expect(result.document.children[0]).toMatchObject({
			construct: 'FieldBlock',
			name: 'Purpose',
		});
	});

	it('WHEN parsing a field block with tags', () => {
		const result = parse('**Purpose:** (#tag)', createDefaultConfig());

		expect(result.document.construct).toBe('Document');
		expect(result.document.children).toHaveLength(1);
		expect(result.document.children[0]).toMatchObject({
			construct: 'FieldBlock',
			name: 'Purpose',
		});
		expect((result.document.children[0] as unknown as { tags: unknown[] }).tags).toHaveLength(1);
	});

	it('GIVEN a parse context, returns it on the result', () => {
		const context = createParseContext({ uri: 'file:///a.md' });

		const result = parse(context, '# Hello', createDefaultConfig());

		expect(result.context).toBe(context);
		expect(result.document.construct).toBe('Document');
	});
});
