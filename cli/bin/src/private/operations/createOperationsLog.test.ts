import { describe, expect, it } from 'vitest';

import { createLoggerMock } from '../../test/helpers/logger/createLoggerMock.js';
import { createParseOperation } from '../commands/parse/private/createParseOperation.js';

import { createOperationSuccess } from './createOperationSuccess.js';
import { createOperationsLog } from './createOperationsLog.js';

const URI = 'file:///tmp/document.art';

describe('createOperationsLog', () => {
	it('GIVEN a logger, forwards pending operations to debug and completed ones to log', () => {
		const logger = createLoggerMock();
		const log = createOperationsLog(logger);
		const pending = createParseOperation({ uri: URI });
		const success = createOperationSuccess(pending);

		log.log(pending);
		log.log(success);

		expect(logger.debug).toHaveBeenCalledWith('⏳', 'parse', URI, '');
		expect(logger.log).toHaveBeenCalledWith(
			'🟢',
			'parse',
			URI,
			expect.stringMatching(/^\(\d+ms\)$/),
		);
		expect(log.all()).toEqual([success]);
	});
});
