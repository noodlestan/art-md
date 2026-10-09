import { beforeEach, describe, expect, it, vi } from 'vitest';

import { makeArtDocumentJSONFixture } from '../../../test/fixtures/makeArtDocumentJSONFixture.js';
import { makeMarkdownStringFixture } from '../../../test/fixtures/makeMarkdownStringFixture.js';
import { createCommandContextMock } from '../../../test/helpers/codec/createCommandContextMock.js';
import { makeOperationPendingFixture } from '../../../test/helpers/operations/makeOperationPendingFixture.js';
import { makeSerializeResultFixture } from '../../../test/helpers/serialize/makeSerializeResultFixture.js';

import { doSerialize } from './doSerialize.js';

const FILE = 'document.art';
const WRITE_TARGET = 'out/document.art';
const STDIN_URI = 'stdin';
const CONTENT = `${makeMarkdownStringFixture()}\n`;

const mocks = vi.hoisted(() => ({
	createSerializeOperation: vi.fn(),
	createOperationSuccess: vi.fn(),
	createOperationFailure: vi.fn(),
}));

vi.mock('./private/createSerializeOperation', () => ({
	createSerializeOperation: mocks.createSerializeOperation,
}));

vi.mock('../../operations/createOperationSuccess', () => ({
	createOperationSuccess: mocks.createOperationSuccess,
}));

vi.mock('../../operations/createOperationFailure', () => ({
	createOperationFailure: mocks.createOperationFailure,
}));

const PENDING = makeOperationPendingFixture({
	operation: 'serialize',
	uri: FILE,
	message: () => FILE,
});
const SUCCESS = {
	...PENDING,
	outcome: 'success' as const,
	finishedTs: new Date('2020-01-01T00:00:01.000Z'),
};
const FAILURE = {
	...PENDING,
	outcome: 'failure' as const,
	error: 'missing input',
	errorSerialized: () => 'SerializeError: missing input',
};

beforeEach(() => {
	mocks.createSerializeOperation.mockReset().mockReturnValue(PENDING);
	mocks.createOperationSuccess.mockReset().mockReturnValue(SUCCESS);
	mocks.createOperationFailure.mockReset().mockReturnValue(FAILURE);
});

describe('doSerialize', () => {
	it('WHEN the document serialises, returns the serialize result', async () => {
		const result = makeSerializeResultFixture(CONTENT, FILE);
		const ctx = createCommandContextMock();
		vi.mocked(ctx.codec.serialize).mockReturnValue(result);
		vi.mocked(ctx.io.readInput).mockResolvedValue(makeArtDocumentJSONFixture());

		const outcome = await doSerialize(ctx, { file: FILE });

		expect(outcome).toBe(result);
	});

	it('WHEN the document serialises, logs the pending and success operations for the uri', async () => {
		const ctx = createCommandContextMock();
		vi.mocked(ctx.codec.serialize).mockReturnValue(makeSerializeResultFixture(CONTENT, FILE));
		vi.mocked(ctx.io.readInput).mockResolvedValue(makeArtDocumentJSONFixture());

		await doSerialize(ctx, { file: FILE });

		expect(mocks.createSerializeOperation).toHaveBeenCalledWith({ uri: FILE });
		expect(mocks.createOperationSuccess).toHaveBeenCalledWith(PENDING);
		expect(ctx.operations.log).toHaveBeenCalledWith(PENDING);
		expect(ctx.operations.log).toHaveBeenCalledWith(SUCCESS);
		expect(ctx.operations.all()).toEqual([SUCCESS]);
	});

	it('WHEN the document serialises, writes the serialized content to stdout', async () => {
		const ctx = createCommandContextMock();
		vi.mocked(ctx.codec.serialize).mockReturnValue(makeSerializeResultFixture(CONTENT, FILE));
		vi.mocked(ctx.io.readInput).mockResolvedValue(makeArtDocumentJSONFixture());

		await doSerialize(ctx, { file: FILE });

		expect(ctx.io.writeOutput).toHaveBeenCalledWith(CONTENT, undefined);
	});

	it('GIVEN a write target, writes the serialized content to it', async () => {
		const ctx = createCommandContextMock();
		vi.mocked(ctx.codec.serialize).mockReturnValue(makeSerializeResultFixture(CONTENT, FILE));
		vi.mocked(ctx.io.readInput).mockResolvedValue(makeArtDocumentJSONFixture());

		await doSerialize(ctx, { file: FILE, write: WRITE_TARGET });

		expect(ctx.io.writeOutput).toHaveBeenCalledWith(CONTENT, WRITE_TARGET);
	});

	it('GIVEN no file, reads stdin and reports the stdin uri', async () => {
		const ctx = createCommandContextMock();
		vi.mocked(ctx.codec.serialize).mockReturnValue(makeSerializeResultFixture(CONTENT, STDIN_URI));
		vi.mocked(ctx.io.readInput).mockResolvedValue(makeArtDocumentJSONFixture());

		const outcome = await doSerialize(ctx, {});

		expect(ctx.io.readInput).toHaveBeenCalledWith(undefined);
		expect(mocks.createSerializeOperation).toHaveBeenCalledWith({ uri: STDIN_URI });
		expect(outcome).not.toBeNull();
	});

	it('WHEN the input is not a document, logs a failure and returns null', async () => {
		const ctx = createCommandContextMock();
		vi.mocked(ctx.io.readInput).mockResolvedValue('not a document');

		const outcome = await doSerialize(ctx, { file: FILE });

		expect(outcome).toBeNull();
		expect(ctx.io.writeOutput).not.toHaveBeenCalled();
		expect(mocks.createOperationFailure).toHaveBeenCalledWith(PENDING, expect.any(Error));
		expect(ctx.operations.all()).toEqual([FAILURE]);
	});

	it('WHEN reading the input fails, logs a failure and returns null', async () => {
		const ctx = createCommandContextMock();
		vi.mocked(ctx.io.readInput).mockRejectedValue(new Error('missing input'));

		const outcome = await doSerialize(ctx, { file: FILE });

		expect(outcome).toBeNull();
		expect(ctx.io.writeOutput).not.toHaveBeenCalled();
		expect(mocks.createOperationFailure).toHaveBeenCalledWith(PENDING, expect.any(Error));
		expect(ctx.operations.all()).toEqual([FAILURE]);
	});

	it('WHEN writing the output fails, logs the success then a failure and returns null', async () => {
		const ctx = createCommandContextMock();
		vi.mocked(ctx.codec.serialize).mockReturnValue(makeSerializeResultFixture(CONTENT, FILE));
		vi.mocked(ctx.io.readInput).mockResolvedValue(makeArtDocumentJSONFixture());
		vi.mocked(ctx.io.writeOutput).mockRejectedValue(new Error('cannot write'));

		const outcome = await doSerialize(ctx, { file: FILE });

		expect(outcome).toBeNull();
		expect(ctx.operations.all()).toEqual([SUCCESS, FAILURE]);
	});
});
