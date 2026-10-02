import type { Mock } from 'vitest';
import { describe, expect, it, vi } from 'vitest';

import { createCodecContext } from '../../private/context/createCodecContext';
import type { CodecContext, CodecIo } from '../../private/context/createCodecContext';
import { createLogger } from '../../private/logger/createLogger';
import type { Operation } from '../../private/operations/types';
import { makeCodecContextMock } from '../../test/helpers/makeCodecContextMock';
import { makeParseFixture } from '../../test/helpers/makeParseFixture';

import { runParse } from './runParse';

const FILE = 'document.art';
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
	logged: Mock<(operation: Operation) => void>;
};

function mockIo(content: string): IoMocks {
	const readInput = vi.fn<CodecIo['readInput']>().mockResolvedValue(content);
	const writeOutput = vi.fn<CodecIo['writeOutput']>().mockResolvedValue(undefined);
	return { readInput, writeOutput };
}

function mockContext(content: string): ContextMock {
	const io = mockIo(content);
	const logger = createLogger();
	const logged: Mock<(operation: Operation) => void> = vi.spyOn(logger, 'log');
	const ctx = createCodecContext(makeCodecContextMock().config, logger);
	ctx.io = io;
	return { ctx, io, logged };
}

describe('runParse', () => {
	it('WHEN run, logs the generic command operation with the options', async () => {
		const { ctx, logged } = mockContext(makeParseFixture());

		await runParse(ctx, { file: FILE });

		const operations = logged.mock.calls.map(call => call[0]);
		const command = operations.find(operation => operation.operation === 'command');
		expect(command?.data).toEqual(['parse', { file: FILE }]);
	});

	it('WHEN the input parses, dispatches to doParse and presents the document', async () => {
		const { ctx, io } = mockContext(makeParseFixture());

		const result = await runParse(ctx, { file: FILE });

		expect(result?.document.construct).toBe('Document');
		expect(io.writeOutput).toHaveBeenCalledWith(OUTLINE, undefined);
	});

	it('WHEN the input parses, logs a success through the operations log', async () => {
		const { ctx } = mockContext(makeParseFixture());

		await runParse(ctx, { file: FILE });

		const operations = ctx.log.all();
		expect(operations).toHaveLength(1);
		expect(operations[0]?.operation).toBe('parse');
		expect(operations[0]?.outcome).toBe('success');
	});

	it('WHEN the input cannot be read, returns null', async () => {
		const { ctx, io } = mockContext(makeParseFixture());
		io.readInput.mockRejectedValue(new Error('missing input'));

		const result = await runParse(ctx, { file: FILE });

		expect(result).toBeNull();
		expect(ctx.log.all()[0]?.outcome).toBe('failure');
	});
});
