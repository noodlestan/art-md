import type { Mock } from 'vitest';
import { describe, expect, it, vi } from 'vitest';

import { createCodecContext } from '../../private/context/createCodecContext';
import type { CodecContext, CodecIo } from '../../private/context/createCodecContext';
import { createLogger } from '../../private/logger/createLogger';
import type { Operation } from '../../private/operations/types';
import { makeCodecContextMock } from '../../test/helpers/makeCodecContextMock';
import { makeDocumentSourceFixture } from '../../test/helpers/makeDocumentSourceFixture';
import { makeParseFixture } from '../../test/helpers/makeParseFixture';

import { runSerialize } from './runSerialize';

const FILE = 'document.art';
const CONTENT = `${makeParseFixture()}\n`;

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

describe('runSerialize', () => {
	it('WHEN run, logs the generic command operation with the options', async () => {
		const { ctx, logged } = mockContext(makeDocumentSourceFixture());

		await runSerialize(ctx, { file: FILE });

		const operations = logged.mock.calls.map(call => call[0]);
		const command = operations.find(operation => operation.operation === 'command');
		expect(command?.data).toEqual(['serialize', { file: FILE }]);
	});

	it('WHEN the document serialises, dispatches to doSerialize and presents the content', async () => {
		const { ctx, io } = mockContext(makeDocumentSourceFixture());

		const result = await runSerialize(ctx, { file: FILE });

		expect(result?.content).toBe(CONTENT);
		expect(io.writeOutput).toHaveBeenCalledWith(CONTENT, undefined);
	});

	it('WHEN the document serialises, logs a success through the operations log', async () => {
		const { ctx } = mockContext(makeDocumentSourceFixture());

		await runSerialize(ctx, { file: FILE });

		const operations = ctx.log.all();
		expect(operations).toHaveLength(1);
		expect(operations[0]?.operation).toBe('serialize');
		expect(operations[0]?.outcome).toBe('success');
	});

	it('WHEN the input cannot be read, returns null', async () => {
		const { ctx, io } = mockContext(makeDocumentSourceFixture());
		io.readInput.mockRejectedValue(new Error('missing input'));

		const result = await runSerialize(ctx, { file: FILE });

		expect(result).toBeNull();
		expect(ctx.log.all()[0]?.outcome).toBe('failure');
	});
});
