import { describe, expect, it, vi } from 'vitest';

import type { ArtCodec } from '../codec/types';
import { makeDocumentMock } from '../test/helpers/document/makeDocumentMock';

import { createArtDocumentSource } from './createArtDocumentSource';
import type { ArtContentSource } from './types';

describe('createArtDocumentSource', () => {
	it('GIVEN a codec and content source, reads and parses content lazily', async () => {
		const document = makeDocumentMock();
		const codecMock: ArtCodec = {
			parse: vi.fn().mockReturnValue({ document, context: { uri: 'file:///a.md' } }),
			serialize: vi.fn(),
		};
		const contentSourceMock: ArtContentSource = {
			type: 'file',
			uri: 'file:///a.md',
			maybeContent: undefined,
			readContent: vi.fn().mockResolvedValue('# Hello'),
			writeContent: vi.fn(),
		};

		const source = createArtDocumentSource(codecMock, contentSourceMock);

		const result = await source.readDocument();

		expect(contentSourceMock.readContent).toHaveBeenCalledTimes(1);
		expect(codecMock.parse).toHaveBeenCalledWith('# Hello');
		expect(result).toBe(document);
		expect(source.maybeDocument).toBe(document);
	});

	it('GIVEN a cached document, does not re-read content', async () => {
		const document = makeDocumentMock();
		const codecMock: ArtCodec = {
			parse: vi.fn().mockReturnValue({ document, context: { uri: 'file:///a.md' } }),
			serialize: vi.fn(),
		};
		const contentSourceMock: ArtContentSource = {
			type: 'file',
			uri: 'file:///a.md',
			maybeContent: undefined,
			readContent: vi.fn().mockResolvedValue('# Hello'),
			writeContent: vi.fn(),
		};

		const source = createArtDocumentSource(codecMock, contentSourceMock);

		await source.readDocument();
		await source.readDocument();

		expect(contentSourceMock.readContent).toHaveBeenCalledTimes(1);
	});

	it('GIVEN a document, serializes and writes content', async () => {
		const document = makeDocumentMock();
		const codecMock: ArtCodec = {
			parse: vi.fn(),
			serialize: vi.fn().mockReturnValue({ content: '# Hello', context: { uri: 'file:///a.md' } }),
		};
		const contentSourceMock: ArtContentSource = {
			type: 'file',
			uri: 'file:///a.md',
			maybeContent: undefined,
			readContent: vi.fn(),
			writeContent: vi.fn(),
		};

		const source = createArtDocumentSource(codecMock, contentSourceMock);

		await source.writeDocument(document);

		expect(codecMock.serialize).toHaveBeenCalledWith(document);
		expect(contentSourceMock.writeContent).toHaveBeenCalledWith('# Hello');
		expect(source.maybeDocument).toBe(document);
	});
});
