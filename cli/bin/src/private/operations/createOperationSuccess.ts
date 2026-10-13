import type { OperationPending, OperationSuccess } from './types.js';

export function createOperationSuccess<T extends OperationPending>(
	pending: T,
	message?: string,
): OperationSuccess {
	const finishedTs = new Date();

	return {
		...pending,
		outcome: 'success',
		finishedTs,
		message: message ? () => message : pending.message,
	};
}
