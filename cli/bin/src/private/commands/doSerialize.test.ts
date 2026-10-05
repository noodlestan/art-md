import type { Mock } from 'vitest';
import { describe, expect, it, vi } from 'vitest';

import { makeCodecContextMock } from '../../test/helpers/makeCodecContextMock';
import { makeDocumentSourceFixture } from '../../test/helpers/makeDocumentSourceFixture';
import { makeParseFixture } from '../../test/helpers/makeParseFixture';
import type { CodecContext, CodecIo } from '../context/createCodecContext';

import { doParse } from './doParse';
import { doSerialize } from './doSerialize';

const FILE = 'document.art';
const WRITE_TARGET = 'out/document.art';
const STDIN_URI = 'stdin';
const CONTENT = `${makeParseFixture()}\n`;

type IoMocks = {
	readInput: Mock<CodecIo['readInput']>;
	writeOutput: Mock<CodecIo['writeOutput']>;
};

type ContextMock = {
	ctx: CodecContext;
	io: IoMocks;
};

function mockIo(content: string): IoMocks {
	const readInput = vi.fn<CodecIo['readInput']>().mockResolvedValue(content);
	const writeOutput = vi.fn<CodecIo['writeOutput']>().mockResolvedValue(undefined);
	return { readInput, writeOutput };
}

function mockContext(content: string): ContextMock {
	const io = mockIo(content);
	const ctx = makeCodecContextMock();
	ctx.io = io;
	return { ctx, io };
}

describe('doSerialize', () => {
	it('WHEN the document serialises, returns the serialize result', async () => {
		const { ctx } = mockContext(makeDocumentSourceFixture());

		const result = await doSerialize(ctx, { file: FILE });

		expect(result?.content).toBe(CONTENT);
	});

	it('WHEN the document serialises, logs a success for the serialized uri', async () => {
		const { ctx } = mockContext(makeDocumentSourceFixture());

		await doSerialize(ctx, { file: FILE });

		const operations = ctx.log.all();
		expect(operations).toHaveLength(1);
		expect(operations[0]?.operation).toBe('serialize');
		expect(operations[0]?.outcome).toBe('success');
		expect(operations[0]?.message()).toBe(FILE);
	});

	it('WHEN the document serialises, presents the serialized content', async () => {
		const { ctx, io } = mockContext(makeDocumentSourceFixture());

		await doSerialize(ctx, { file: FILE });

		expect(io.writeOutput).toHaveBeenCalledWith(CONTENT, undefined);
	});

	it('GIVEN a write target, writes the serialized content to it', async () => {
		const { ctx, io } = mockContext(makeDocumentSourceFixture());

		await doSerialize(ctx, { file: FILE, write: WRITE_TARGET });

		expect(io.writeOutput).toHaveBeenCalledWith(CONTENT, WRITE_TARGET);
	});

	it('GIVEN no file, reads stdin and reports the stdin uri', async () => {
		const { ctx, io } = mockContext(makeDocumentSourceFixture());

		const result = await doSerialize(ctx, {});

		expect(io.readInput).toHaveBeenCalledWith(undefined);
		expect(result).not.toBeNull();
		expect(ctx.log.all()[0]?.message()).toBe(STDIN_URI);
	});

	it('WHEN the input is not a document, logs a failure and returns null', async () => {
		const { ctx, io } = mockContext('not a document');

		const result = await doSerialize(ctx, { file: FILE });

		expect(result).toBeNull();
		expect(io.writeOutput).not.toHaveBeenCalled();
		const operations = ctx.log.all();
		expect(operations).toHaveLength(1);
		expect(operations[0]?.outcome).toBe('failure');
	});

	it('WHEN reading the input fails, logs a failure and returns null', async () => {
		const io = mockIo('');
		io.readInput.mockRejectedValue(new Error('missing input'));
		const ctx = makeCodecContextMock();
		ctx.io = io;

		const result = await doSerialize(ctx, { file: FILE });

		expect(result).toBeNull();
		expect(io.writeOutput).not.toHaveBeenCalled();
		const operations = ctx.log.all();
		expect(operations).toHaveLength(1);
		expect(operations[0]?.outcome).toBe('failure');
		expect(operations[0]?.message()).toBe('missing input');
	});

	it('WHEN writing the output fails, logs the success then a failure and returns null', async () => {
		const { ctx, io } = mockContext(makeDocumentSourceFixture());
		io.writeOutput.mockRejectedValue(new Error('cannot write'));

		const result = await doSerialize(ctx, { file: FILE });

		expect(result).toBeNull();
		const operations = ctx.log.all();
		expect(operations).toHaveLength(2);
		expect(operations[1]?.outcome).toBe('failure');
	});

	it('GIVEN a document from doParse, roundtrips the fixture back to the same markdown', async () => {
		const parseContext = mockContext(makeParseFixture());
		await doParse(parseContext.ctx, { file: FILE });
		const documentSource = parseContext.io.writeOutput.mock.calls[0]?.[0] ?? '';
		const { ctx, io } = mockContext(documentSource);

		await doSerialize(ctx, { file: FILE });

		const written = io.writeOutput.mock.calls[0]?.[0] ?? '';
		expect(written.trimEnd()).toBe(makeParseFixture());
	});
});
