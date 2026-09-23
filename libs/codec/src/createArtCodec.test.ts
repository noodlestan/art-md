import type { SectionBlock } from '@art-md/constructs';
import { createParseContext, createSerializeContext } from '@art-md/primitives';
import { describe, expect, it } from 'vitest';

import { createArtCodec } from './createArtCodec';

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
});
