import { formatData } from './private/formatData.js';
import type { OperationPending } from './types.js';

export function createGenericOperation(operation: string, data?: unknown): OperationPending {
	const ts = new Date();

	return {
		ts,
		outcome: 'pending',
		operation,
		data,
		message() {
			return formatData(data);
		},
		timing() {
			return this.finishedTs ? this.finishedTs.getTime() - this.ts.getTime() : NaN;
		},
	};
}
