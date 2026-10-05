import { afterEach, describe, expect, it, vi } from 'vitest';

import { createParseOperation } from '../../operations/createParseOperation';

import { createCommandContext } from './createCommandContext';

const URI = 'stdin';

afterEach(() => {
	vi.restoreAllMocks();
});

describe('createCommandContext', () => {
	it('WHEN created, carries the bin config and a codec', () => {
		const ctx = createCommandContext(undefined);

		expect(ctx.config.output.mode).toBe('quiet');
		expect(ctx.codec.parse('# Title').document.construct).toBe('Document');
	});

	it('WHEN created, attaches the io helpers', () => {
		const ctx = createCommandContext(undefined);

		expect(typeof ctx.io.readInput).toBe('function');
		expect(typeof ctx.io.writeOutput).toBe('function');
	});

	it('GIVEN a verbose output mode, logs the operations of the command', () => {
		const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
		const ctx = createCommandContext('verbose');

		ctx.log.log(createParseOperation({ uri: URI }));

		expect(errorSpy).toHaveBeenCalledTimes(1);
		expect(errorSpy.mock.calls[0]?.[0]).toContain('parse');
	});

	it('GIVEN a quiet output mode, discards the pending operations of the command', () => {
		const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
		const ctx = createCommandContext('quiet');

		ctx.log.log(createParseOperation({ uri: URI }));

		expect(errorSpy).not.toHaveBeenCalled();
	});

	it('GIVEN an unknown output mode, discards the pending operations of the command', () => {
		const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
		const ctx = createCommandContext('loud');

		ctx.log.log(createParseOperation({ uri: URI }));

		expect(errorSpy).not.toHaveBeenCalled();
	});
});
