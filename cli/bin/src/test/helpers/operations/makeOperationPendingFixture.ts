import type { OperationPending } from '../../../private/operations/types.js';

export function makeOperationPendingFixture(
	overrides: Partial<OperationPending> & { uri?: string } = {},
): OperationPending {
	return {
		ts: new Date('2020-01-01T00:00:00.000Z'),
		outcome: 'pending',
		operation: 'generic',
		message: () => '',
		timing: () => NaN,
		...overrides,
	};
}
