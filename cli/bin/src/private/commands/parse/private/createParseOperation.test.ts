import { describe, expect, it } from 'vitest';

import { createOperationSuccess } from '../../../operations/createOperationSuccess.js';

import { createParseOperation } from './createParseOperation.js';

const URI = 'file:///tmp/document.art';

describe('createParseOperation', () => {
	it('GIVEN a uri', () => {
		const pending = createParseOperation({ uri: URI });

		expect(pending.operation).toBe('parse');
		expect(pending.outcome).toBe('pending');
		expect(pending.uri).toBe(URI);
		expect(pending.message()).toBe(URI);
		expect(pending.timing()).toBeNaN();
	});

	it('GIVEN a stamped parse operation', () => {
		const success = createOperationSuccess(createParseOperation({ uri: URI }));

		expect(success.timing()).toBeGreaterThanOrEqual(0);
	});
});
