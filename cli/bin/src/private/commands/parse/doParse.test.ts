import { beforeEach, describe, expect, it, vi } from 'vitest';

import { makeMarkdownStringFixture } from '../../../test/fixtures/makeMarkdownStringFixture';
import { createCommandContextMock } from '../../../test/helpers/codec/createCommandContextMock';
import { makeOperationPendingFixture } from '../../../test/helpers/operations/makeOperationPendingFixture';
import { makeParseResultFixture } from '../../../test/helpers/parse/makeParseResultFixture';

import { doParse } from './doParse';

const FILE = 'document.art';
const WRITE_TARGET = 'out/document.art';
const STDIN_URI = 'stdin';
const PRESENTED = '{"construct":"Document"}';

const mocks = vi.hoisted(() => ({
	createParseOperation: vi.fn(),
	createOperationSuccess: vi.fn(),
	createOperationFailure: vi.fn(),
	presentDocument: vi.fn(),
}));

vi.mock('./private/createParseOperation', () => ({
	createParseOperation: mocks.createParseOperation,
}));

vi.mock('../../operations/createOperationSuccess', () => ({
	createOperationSuccess: mocks.createOperationSuccess,
}));

vi.mock('../../operations/createOperationFailure', () => ({
	createOperationFailure: mocks.createOperationFailure,
}));

vi.mock('../../presentation/presentDocument', () => ({
	presentDocument: mocks.presentDocument,
}));

const PENDING = makeOperationPendingFixture({ operation: 'parse', uri: FILE, message: () => FILE });
const SUCCESS = {
	...PENDING,
	outcome: 'success' as const,
	finishedTs: new Date('2020-01-01T00:00:01.000Z'),
};
const FAILURE = {
	...PENDING,
	outcome: 'failure' as const,
	error: 'missing input',
	errorSerialized: () => 'ParseError: missing input',
};

beforeEach(() => {
	mocks.createParseOperation.mockReset().mockReturnValue(PENDING);
	mocks.createOperationSuccess.mockReset().mockReturnValue(SUCCESS);
	mocks.createOperationFailure.mockReset().mockReturnValue(FAILURE);
	mocks.presentDocument.mockReset().mockReturnValue(PRESENTED);
});

describe('doParse', () => {
	it('WHEN the input parses, returns the parse result', async () => {
		const result = makeParseResultFixture(FILE);
		const ctx = createCommandContextMock();
		vi.mocked(ctx.codec.parse).mockReturnValue(result);
		vi.mocked(ctx.io.readInput).mockResolvedValue(makeMarkdownStringFixture());

		const outcome = await doParse(ctx, { file: FILE });

		expect(outcome).toBe(result);
	});

	it('WHEN the input parses, logs the pending and success operations for the uri', async () => {
		const ctx = createCommandContextMock();
		vi.mocked(ctx.codec.parse).mockReturnValue(makeParseResultFixture(FILE));
		vi.mocked(ctx.io.readInput).mockResolvedValue(makeMarkdownStringFixture());

		await doParse(ctx, { file: FILE });

		expect(mocks.createParseOperation).toHaveBeenCalledWith({ uri: FILE });
		expect(mocks.createOperationSuccess).toHaveBeenCalledWith(PENDING);
		expect(ctx.operations.log).toHaveBeenCalledWith(PENDING);
		expect(ctx.operations.log).toHaveBeenCalledWith(SUCCESS);
		expect(ctx.operations.all()).toEqual([SUCCESS]);
	});

	it('WHEN the input parses, writes the presented document to stdout', async () => {
		const ctx = createCommandContextMock();
		vi.mocked(ctx.codec.parse).mockReturnValue(makeParseResultFixture(FILE));
		vi.mocked(ctx.io.readInput).mockResolvedValue(makeMarkdownStringFixture());

		await doParse(ctx, { file: FILE });

		expect(mocks.presentDocument).toHaveBeenCalledWith(makeParseResultFixture(FILE).document);
		expect(ctx.io.writeOutput).toHaveBeenCalledWith(PRESENTED, undefined);
	});

	it('GIVEN a write target, writes the presented document to it', async () => {
		const ctx = createCommandContextMock();
		vi.mocked(ctx.codec.parse).mockReturnValue(makeParseResultFixture(FILE));
		vi.mocked(ctx.io.readInput).mockResolvedValue(makeMarkdownStringFixture());

		await doParse(ctx, { file: FILE, write: WRITE_TARGET });

		expect(ctx.io.writeOutput).toHaveBeenCalledWith(PRESENTED, WRITE_TARGET);
	});

	it('GIVEN no file, reads stdin and reports the stdin uri', async () => {
		const ctx = createCommandContextMock();
		vi.mocked(ctx.codec.parse).mockReturnValue(makeParseResultFixture(STDIN_URI));
		vi.mocked(ctx.io.readInput).mockResolvedValue(makeMarkdownStringFixture());

		const outcome = await doParse(ctx, {});

		expect(ctx.io.readInput).toHaveBeenCalledWith(undefined);
		expect(mocks.createParseOperation).toHaveBeenCalledWith({ uri: STDIN_URI });
		expect(outcome).not.toBeNull();
	});

	it('WHEN reading the input fails, logs a failure and returns null', async () => {
		const ctx = createCommandContextMock();
		vi.mocked(ctx.io.readInput).mockRejectedValue(new Error('missing input'));

		const outcome = await doParse(ctx, { file: FILE });

		expect(outcome).toBeNull();
		expect(ctx.io.writeOutput).not.toHaveBeenCalled();
		expect(mocks.createOperationFailure).toHaveBeenCalledWith(PENDING, expect.any(Error));
		expect(ctx.operations.all()).toEqual([FAILURE]);
	});

	it('WHEN writing the output fails, logs the success then a failure and returns null', async () => {
		const ctx = createCommandContextMock();
		vi.mocked(ctx.codec.parse).mockReturnValue(makeParseResultFixture(FILE));
		vi.mocked(ctx.io.readInput).mockResolvedValue(makeMarkdownStringFixture());
		vi.mocked(ctx.io.writeOutput).mockRejectedValue(new Error('cannot write'));

		const outcome = await doParse(ctx, { file: FILE });

		expect(outcome).toBeNull();
		expect(ctx.operations.all()).toEqual([SUCCESS, FAILURE]);
	});
});
