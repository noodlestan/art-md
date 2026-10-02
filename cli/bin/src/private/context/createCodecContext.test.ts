import { describe, expect, it, vi } from 'vitest';

import { makeCodecContextMock } from '../../test/helpers/makeCodecContextMock';
import { makeConfigMock } from '../../test/helpers/makeConfigMock';
import { createLogger } from '../logger/createLogger';
import { createOperationSuccess } from '../operations/createOperationSuccess';
import { createParseOperation } from '../operations/createParseOperation';

import { createCodecContext } from './createCodecContext';

describe('createCodecContext', () => {
	it('WHEN created, returns the config it was given', () => {
		const ctx = makeCodecContextMock({ output: { mode: 'verbose' } });

		expect(ctx.config.output.mode).toBe('verbose');
	});

	it('WHEN created, composes a codec from the codec config', () => {
		const ctx = makeCodecContextMock();

		const result = ctx.codec.parse('# Title');

		expect(result.document.construct).toBe('Document');
		expect(result.document.children[0]?.construct).toBe('SectionBlock');
	});

	it('GIVEN codec config overrides, the codec honours them', () => {
		const ctx = makeCodecContextMock({ codec: { parserConfig: { constructs: [] } } });

		const result = ctx.codec.parse('# Title');

		expect(result.document.children).toEqual([]);
	});

	it('WHEN created, attaches the io helpers', () => {
		const ctx = makeCodecContextMock();

		expect(typeof ctx.io.readInput).toBe('function');
		expect(typeof ctx.io.writeOutput).toBe('function');
	});

	it('WHEN an operation is logged, the log forwards it to the logger and keeps it', () => {
		const logger = createLogger();
		const logSpy = vi.spyOn(logger, 'log');
		const ctx = createCodecContext(makeConfigMock(), logger);
		const pending = createParseOperation({ uri: 'file:///a.md' });
		const success = createOperationSuccess(pending);

		ctx.log.log(success);

		expect(logSpy).toHaveBeenCalledWith(success);
		expect(ctx.log.all()).toEqual([success]);
	});

	it('WHEN a pending operation is logged, the log does not keep it', () => {
		const ctx = makeCodecContextMock();

		ctx.log.log(createParseOperation({ uri: 'file:///a.md' }));

		expect(ctx.log.all()).toEqual([]);
	});
});
