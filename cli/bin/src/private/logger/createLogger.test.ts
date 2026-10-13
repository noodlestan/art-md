import { describe, expect, it, vi } from 'vitest';

import { createLogger } from './createLogger.js';
import type { LogWriter } from './types.js';

describe('createLogger', () => {
	it('GIVEN messages logged before the output mode, buffers them', () => {
		const writeMock = vi.fn<LogWriter>();
		const logger = createLogger(writeMock);

		logger.log('boot');
		logger.debug('parse', 'document.art');

		expect(writeMock).not.toHaveBeenCalled();
	});

	it('GIVEN a verbose output mode set after logging, flushes the buffer', () => {
		const writeMock = vi.fn<LogWriter>();
		const logger = createLogger(writeMock);

		logger.log('boot');
		logger.debug('parse', 'document.art');
		logger.setVerbosity('verbose');

		expect(writeMock).toHaveBeenCalledTimes(2);
		expect(writeMock).toHaveBeenCalledWith({
			level: 'log',
			args: ['boot'],
		});
		expect(writeMock).toHaveBeenCalledWith({
			level: 'debug',
			args: ['parse', 'document.art'],
		});
	});

	it('GIVEN a quiet output mode set after logging, drops the buffer', () => {
		const writeMock = vi.fn<LogWriter>();
		const logger = createLogger(writeMock);

		logger.log('boot');
		logger.setVerbosity('quiet');

		expect(writeMock).not.toHaveBeenCalled();
	});

	it('GIVEN a quiet output mode, writes nothing', () => {
		const writeMock = vi.fn<LogWriter>();
		const logger = createLogger(writeMock);

		logger.setVerbosity('quiet');
		logger.log('boot');
		logger.debug('parse', 'document.art');

		expect(writeMock).not.toHaveBeenCalled();
	});

	it('GIVEN a default output mode, writes log messages but not debug messages', () => {
		const writeMock = vi.fn<LogWriter>();
		const logger = createLogger(writeMock);

		logger.setVerbosity('default');
		logger.log('boot');
		logger.debug('parse', 'document.art');

		expect(writeMock).toHaveBeenCalledTimes(1);
		expect(writeMock).toHaveBeenCalledWith({
			level: 'log',
			args: ['boot'],
		});
	});

	it('GIVEN a verbose output mode, writes log and debug messages', () => {
		const writeMock = vi.fn<LogWriter>();
		const logger = createLogger(writeMock);

		logger.setVerbosity('verbose');
		logger.log('boot');
		logger.debug('parse', 'document.art');

		expect(writeMock).toHaveBeenCalledTimes(2);
		expect(writeMock).toHaveBeenCalledWith({
			level: 'log',
			args: ['boot'],
		});
		expect(writeMock).toHaveBeenCalledWith({
			level: 'debug',
			args: ['parse', 'document.art'],
		});
	});

	it('GIVEN a verbose output mode set twice, flushes the buffer once', () => {
		const writeMock = vi.fn<LogWriter>();
		const logger = createLogger(writeMock);

		logger.log('boot');
		logger.setVerbosity('verbose');
		logger.setVerbosity('verbose');

		expect(writeMock).toHaveBeenCalledTimes(1);
	});
});
