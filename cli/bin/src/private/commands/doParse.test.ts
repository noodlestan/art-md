import type { Mock } from 'vitest';
import { describe, expect, it, vi } from 'vitest';

import { makeCodecContextMock } from '../../test/helpers/makeCodecContextMock';
import { makeParseFixture } from '../../test/helpers/makeParseFixture';
import type { CodecContext, CodecIo } from '../context/createCodecContext';

import { doParse } from './doParse';

const FILE = 'document.art';
const WRITE_TARGET = 'out/document.art';
const STDIN_URI = 'stdin';
const OUTLINE = [
	'Document',
	'  SectionBlock: Title',
	'    NaturalBlock',
	'      NaturalExpression',
].join('\n');

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

describe('doParse', () => {
	it('WHEN the input parses, returns the parse result', async () => {
		const { ctx } = mockContext(makeParseFixture());

		const result = await doParse(ctx, { file: FILE });

		expect(result?.document.construct).toBe('Document');
	});

	it('WHEN the input parses, logs a success for the parsed uri', async () => {
		const { ctx } = mockContext(makeParseFixture());

		await doParse(ctx, { file: FILE });

		const operations = ctx.log.all();
		expect(operations).toHaveLength(1);
		expect(operations[0]?.operation).toBe('parse');
		expect(operations[0]?.outcome).toBe('success');
		expect(operations[0]?.message()).toBe(FILE);
	});

	it('WHEN the input parses, presents the construct outline', async () => {
		const { ctx, io } = mockContext(makeParseFixture());

		await doParse(ctx, { file: FILE });

		expect(io.writeOutput).toHaveBeenCalledWith(OUTLINE, undefined);
	});

	it('GIVEN a write target, writes the presented document to it', async () => {
		const { ctx, io } = mockContext(makeParseFixture());

		await doParse(ctx, { file: FILE, write: WRITE_TARGET });

		expect(io.writeOutput).toHaveBeenCalledWith(OUTLINE, WRITE_TARGET);
	});

	it('GIVEN json, presents the indented JSON document', async () => {
		const { ctx, io } = mockContext(makeParseFixture());

		const result = await doParse(ctx, { file: FILE, json: true });

		const written = io.writeOutput.mock.calls[0]?.[0] ?? '';
		expect(JSON.parse(written)).toEqual(result?.document);
	});

	it('GIVEN no file, reads stdin and reports the stdin uri', async () => {
		const { ctx, io } = mockContext(makeParseFixture());

		const result = await doParse(ctx, {});

		expect(io.readInput).toHaveBeenCalledWith(undefined);
		expect(result).not.toBeNull();
		expect(ctx.log.all()[0]?.message()).toBe(STDIN_URI);
	});

	it('WHEN reading the input fails, logs a failure and returns null', async () => {
		const io = mockIo('');
		io.readInput.mockRejectedValue(new Error('missing input'));
		const ctx = makeCodecContextMock();
		ctx.io = io;

		const result = await doParse(ctx, { file: FILE });

		expect(result).toBeNull();
		expect(io.writeOutput).not.toHaveBeenCalled();
		const operations = ctx.log.all();
		expect(operations).toHaveLength(1);
		expect(operations[0]?.outcome).toBe('failure');
		expect(operations[0]?.message()).toBe('missing input');
	});

	it('WHEN writing the output fails, logs the success then a failure and returns null', async () => {
		const { ctx, io } = mockContext(makeParseFixture());
		io.writeOutput.mockRejectedValue(new Error('cannot write'));

		const result = await doParse(ctx, { file: FILE });

		expect(result).toBeNull();
		const operations = ctx.log.all();
		expect(operations).toHaveLength(2);
		expect(operations[1]?.outcome).toBe('failure');
	});
});
