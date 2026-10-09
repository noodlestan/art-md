import { describe, expect, it } from 'vitest';

import { createOperationSuccess } from '../../../operations/createOperationSuccess.js';

import { createSerializeOperation } from './createSerializeOperation.js';

const URI = 'file:///tmp/document.art';

describe('createSerializeOperation', () => {
	it('GIVEN a uri', () => {
		const pending = createSerializeOperation({ uri: URI });

		expect(pending.operation).toBe('serialize');
		expect(pending.outcome).toBe('pending');
		expect(pending.uri).toBe(URI);
		expect(pending.message()).toBe(URI);
		expect(pending.timing()).toBeNaN();
	});

	it('GIVEN a stamped serialize operation', () => {
		const success = createOperationSuccess(createSerializeOperation({ uri: URI }));

		expect(success.timing()).toBeGreaterThanOrEqual(0);
	});
});
