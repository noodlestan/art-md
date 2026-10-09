import { describe, expect, it, vi } from 'vitest';

import { makeConfigFixture } from '../../test/helpers/config/makeConfigFixture.js';
import { createCommandIoMock } from '../../test/helpers/io/createCommandIoMock.js';
import { createLoggerMock } from '../../test/helpers/logger/createLoggerMock.js';

import { createCommandContext } from './createCommandContext.js';

const mocks = vi.hoisted(() => ({
	createArtCodec: vi.fn(),
	createCommandIo: vi.fn(),
	createOperationsLog: vi.fn(),
}));

vi.mock('@art-md/codec', () => ({
	createArtCodec: mocks.createArtCodec,
}));

vi.mock('../io/createCommandIo', () => ({
	createCommandIo: mocks.createCommandIo,
}));

vi.mock('../operations/createOperationsLog', () => ({
	createOperationsLog: mocks.createOperationsLog,
}));

describe('createCommandContext', () => {
	it('WHEN created, returns the config it was given', () => {
		const config = makeConfigFixture({ output: { mode: 'verbose' } });

		const ctx = createCommandContext(config, createLoggerMock());

		expect(ctx.config).toBe(config);
	});

	it('WHEN created, composes the codec from the codec config', () => {
		const codec = { parse: vi.fn(), serialize: vi.fn() };
		mocks.createArtCodec.mockReturnValue(codec);
		const config = makeConfigFixture({ codec: { parserConfig: { constructs: [] } } });

		const ctx = createCommandContext(config, createLoggerMock());

		expect(mocks.createArtCodec).toHaveBeenCalledWith(config.codec);
		expect(ctx.codec).toBe(codec);
	});

	it('WHEN created, composes the operations log from the logger', () => {
		const operations = { log: vi.fn(), all: vi.fn() };
		mocks.createOperationsLog.mockReturnValue(operations);
		const logger = createLoggerMock();

		const ctx = createCommandContext(makeConfigFixture(), logger);

		expect(mocks.createOperationsLog).toHaveBeenCalledWith(logger);
		expect(ctx.operations).toBe(operations);
	});

	it('WHEN created, composes the io from the io factory', () => {
		const io = createCommandIoMock();
		mocks.createCommandIo.mockReturnValue(io);

		const ctx = createCommandContext(makeConfigFixture(), createLoggerMock());

		expect(ctx.io).toBe(io);
	});
});
