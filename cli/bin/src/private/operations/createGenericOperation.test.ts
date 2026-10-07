import { describe, expect, it } from 'vitest';

import { createGenericOperation } from './createGenericOperation';
import { createOperationSuccess } from './createOperationSuccess';

const URI = 'file:///tmp/document.art';

describe('createGenericOperation', () => {
	it('GIVEN no data', () => {
		const pending = createGenericOperation('boot');

		expect(pending.operation).toBe('boot');
		expect(pending.outcome).toBe('pending');
		expect(pending.message()).toBe('');
	});

	it('GIVEN data', () => {
		const pending = createGenericOperation('command', ['parse', URI]);

		expect(pending.data).toEqual(['parse', URI]);
		expect(pending.message()).toBe(JSON.stringify(['parse', URI]));
	});

	it('GIVEN the operation is pending', () => {
		const pending = createGenericOperation('boot');

		expect(pending.finishedTs).toBeUndefined();
		expect(pending.timing()).toBeNaN();
	});

	it('GIVEN a stamped generic operation', () => {
		const success = createOperationSuccess(createGenericOperation('boot'));

		expect(success.timing()).toBeGreaterThanOrEqual(0);
	});
});
