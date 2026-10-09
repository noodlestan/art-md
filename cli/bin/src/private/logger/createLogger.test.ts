import { describe, expect, it, vi } from 'vitest';

import { createLogger } from './createLogger.js';
import type { LogWriter } from './types.js';

describe('createLogger', () => {
	it('GIVEN messages logged before the output mode, buffers them', () => {
		const write = vi.fn<LogWriter>();
		const logger = createLogger(write);

		logger.log('boot');
		logger.debug('parse', 'document.art');

		expect(write).not.toHaveBeenCalled();
	});

	it('GIVEN a verbose output mode set after logging, flushes the buffer', () => {
		const write = vi.fn<LogWriter>();
		const logger = createLogger(write);

		logger.log('boot');
		logger.debug('parse', 'document.art');
		logger.setVerbosity('verbose');

		expect(write).toHaveBeenCalledTimes(2);
		expect(write).toHaveBeenCalledWith({ level: 'log', args: ['boot'] });
		expect(write).toHaveBeenCalledWith({ level: 'debug', args: ['parse', 'document.art'] });
	});

	it('GIVEN a quiet output mode set after logging, drops the buffer', () => {
		const write = vi.fn<LogWriter>();
		const logger = createLogger(write);

		logger.log('boot');
		logger.setVerbosity('quiet');

		expect(write).not.toHaveBeenCalled();
	});

	it('GIVEN a quiet output mode, writes nothing', () => {
		const write = vi.fn<LogWriter>();
		const logger = createLogger(write);

		logger.setVerbosity('quiet');
		logger.log('boot');
		logger.debug('parse', 'document.art');

		expect(write).not.toHaveBeenCalled();
	});

	it('GIVEN a default output mode, writes log messages but not debug messages', () => {
		const write = vi.fn<LogWriter>();
		const logger = createLogger(write);

		logger.setVerbosity('default');
		logger.log('boot');
		logger.debug('parse', 'document.art');

		expect(write).toHaveBeenCalledTimes(1);
		expect(write).toHaveBeenCalledWith({ level: 'log', args: ['boot'] });
	});

	it('GIVEN a verbose output mode, writes log and debug messages', () => {
		const write = vi.fn<LogWriter>();
		const logger = createLogger(write);

		logger.setVerbosity('verbose');
		logger.log('boot');
		logger.debug('parse', 'document.art');

		expect(write).toHaveBeenCalledTimes(2);
		expect(write).toHaveBeenCalledWith({ level: 'log', args: ['boot'] });
		expect(write).toHaveBeenCalledWith({ level: 'debug', args: ['parse', 'document.art'] });
	});

	it('GIVEN a verbose output mode set twice, flushes the buffer once', () => {
		const write = vi.fn<LogWriter>();
		const logger = createLogger(write);

		logger.log('boot');
		logger.setVerbosity('verbose');
		logger.setVerbosity('verbose');

		expect(write).toHaveBeenCalledTimes(1);
	});
});
