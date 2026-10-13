import { afterEach, describe, expect, it, vi } from 'vitest';

import { createConsoleWriter } from './createConsoleWriter.js';

describe('createConsoleWriter', () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('GIVEN a stdout writer, writes log messages to console.info', () => {
		const infoSpy = vi.spyOn(console, 'info').mockImplementation(() => undefined);
		const debugSpy = vi.spyOn(console, 'debug').mockImplementation(() => undefined);
		const write = createConsoleWriter('stdout');

		write({
			level: 'log',
			args: ['boot'],
		});

		expect(infoSpy).toHaveBeenCalledWith('boot');
		expect(debugSpy).not.toHaveBeenCalled();
	});

	it('GIVEN a stdout writer, writes debug messages to console.debug', () => {
		const infoSpy = vi.spyOn(console, 'info').mockImplementation(() => undefined);
		const debugSpy = vi.spyOn(console, 'debug').mockImplementation(() => undefined);
		const write = createConsoleWriter('stdout');

		write({
			level: 'debug',
			args: ['parse', 'document.art'],
		});

		expect(debugSpy).toHaveBeenCalledWith('parse', 'document.art');
		expect(infoSpy).not.toHaveBeenCalled();
	});

	it('GIVEN a stderr writer, writes log messages to console.error', () => {
		const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
		const write = createConsoleWriter('stderr');

		write({
			level: 'log',
			args: ['boot'],
		});

		expect(errorSpy).toHaveBeenCalledWith('boot');
	});

	it('GIVEN a stderr writer, writes debug messages to console.error', () => {
		const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
		const write = createConsoleWriter('stderr');

		write({
			level: 'debug',
			args: ['parse', 'document.art'],
		});

		expect(errorSpy).toHaveBeenCalledWith('parse', 'document.art');
	});
});
