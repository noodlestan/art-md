import { extractReason } from './private/extractReason.js';
import { formatRawError } from './private/formatRawError.js';
import { getFailureLabel } from './private/getFailureLabel.js';
import type { OperationFailure, OperationPending } from './types.js';

export function createOperationFailure<T extends OperationPending>(
	pending: T,
	error: unknown,
): OperationFailure {
	const rawError = error instanceof Error ? error.message : String(error);
	const label = getFailureLabel(pending.operation);
	const finishedTs = new Date();

	return {
		...pending,
		outcome: 'failure',
		finishedTs,
		error: rawError,
		message() {
			return extractReason(this.error);
		},
		errorSerialized() {
			return `${label}: ${this.message()}\n\n${formatRawError(this.error)}`;
		},
	};
}
