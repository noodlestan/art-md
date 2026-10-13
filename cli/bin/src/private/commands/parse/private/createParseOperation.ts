import type { ParsePending } from '../../../operations/types.js';

export function createParseOperation(data: { uri: string }): ParsePending {
	const ts = new Date();

	return {
		ts,
		outcome: 'pending',
		operation: 'parse',
		uri: data.uri,
		message() {
			return data.uri;
		},
		timing() {
			return this.finishedTs ? this.finishedTs.getTime() - this.ts.getTime() : NaN;
		},
	};
}
