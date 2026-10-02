import type { ParsePending } from './types';

export function createParseOperation(data: { uri: string }): ParsePending {
	return {
		ts: new Date(),
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
