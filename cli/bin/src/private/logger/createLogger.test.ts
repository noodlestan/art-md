import { afterEach, describe, expect, it, vi } from 'vitest';

import { createGenericOperation } from '../operations/createGenericOperation';
import { createOperationSuccess } from '../operations/createOperationSuccess';
import { createParseOperation } from '../operations/createParseOperation';

import { createLogger } from './createLogger';

const URI = 'file:///tmp/document.art';

afterEach(() => {
	vi.restoreAllMocks();
});

describe('createLogger', () => {
	it('GIVEN pending operations logged before the output mode', () => {
		const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
		const logger = createLogger();

		logger.log(createParseOperation({ uri: URI }));

		expect(errorSpy).not.toHaveBeenCalled();
	});

	it('GIVEN a verbose output mode set after logging pending operations', () => {
		const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
		const logger = createLogger();

		logger.log(createParseOperation({ uri: URI }));
		logger.setOutputMode('verbose');

		expect(errorSpy).toHaveBeenCalledTimes(1);
		expect(errorSpy.mock.calls[0]?.[0]).toContain('parse');
		expect(errorSpy.mock.calls[0]?.[0]).toContain(URI);
	});

	it('GIVEN a quiet output mode set after logging pending operations', () => {
		const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
		const logger = createLogger();

		logger.log(createParseOperation({ uri: URI }));
		logger.setOutputMode('quiet');

		expect(errorSpy).not.toHaveBeenCalled();
	});

	it('GIVEN an unknown output mode', () => {
		const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
		const logger = createLogger();

		logger.log(createParseOperation({ uri: URI }));
		logger.setOutputMode('loud');
		logger.log(createGenericOperation('boot'));

		expect(errorSpy).not.toHaveBeenCalled();
	});

	it('GIVEN no output mode', () => {
		const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
		const logger = createLogger();

		logger.setOutputMode(undefined);
		logger.log(createParseOperation({ uri: URI }));

		expect(errorSpy).not.toHaveBeenCalled();
	});

	it('GIVEN a quiet output mode and pending operations logged after it', () => {
		const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
		const logger = createLogger();

		logger.setOutputMode('quiet');
		logger.log(createParseOperation({ uri: URI }));

		expect(errorSpy).not.toHaveBeenCalled();
	});

	it('GIVEN a quiet output mode and a resolved operation', () => {
		const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
		const logger = createLogger();
		const pending = createParseOperation({ uri: URI });

		logger.setOutputMode('quiet');
		logger.log(pending);
		logger.log(createOperationSuccess(pending));

		expect(errorSpy).toHaveBeenCalledTimes(1);
		expect(errorSpy.mock.calls[0]?.[0]).toContain('🟢');
		expect(errorSpy.mock.calls[0]?.[0]).toContain('ms)');
	});

	it('GIVEN a verbose output mode and a pending operation logged after it', () => {
		const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
		const logger = createLogger();

		logger.setOutputMode('verbose');
		logger.log(createParseOperation({ uri: URI }));

		expect(errorSpy).toHaveBeenCalledTimes(1);
		expect(errorSpy.mock.calls[0]?.[0]).toContain('⏳');
	});

	it('GIVEN a verbose output mode set twice', () => {
		const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
		const logger = createLogger();

		logger.log(createParseOperation({ uri: URI }));
		logger.setOutputMode('verbose');
		logger.setOutputMode('verbose');

		expect(errorSpy).toHaveBeenCalledTimes(1);
	});
});
