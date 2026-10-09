import { describe, expect, it } from 'vitest';

import { createParseOperation } from '../commands/parse/private/createParseOperation.js';
import { createSerializeOperation } from '../commands/serialize/private/createSerializeOperation.js';

import { createOperationSuccess } from './createOperationSuccess.js';

const URI = 'file:///tmp/document.art';

describe('createOperationSuccess', () => {
	it('GIVEN a pending parse operation', () => {
		const pending = createParseOperation({ uri: URI });

		const success = createOperationSuccess(pending);

		expect(success.outcome).toBe('success');
		expect(success.operation).toBe('parse');
		expect(success.message()).toBe(URI);
		expect(success.finishedTs).toBeInstanceOf(Date);
	});

	it('GIVEN the pending operation and a message', () => {
		const pending = createSerializeOperation({ uri: URI });

		const success = createOperationSuccess(pending, 'serialized 1 construct');

		expect(success.message()).toBe('serialized 1 construct');
	});

	it('GIVEN a stamped success', () => {
		const success = createOperationSuccess(createParseOperation({ uri: URI }));

		expect(success.timing()).toBeGreaterThanOrEqual(0);
	});
});
