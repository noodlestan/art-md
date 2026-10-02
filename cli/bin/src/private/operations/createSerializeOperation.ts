import type { SerializePending } from './types';

export function createSerializeOperation(data: { uri: string }): SerializePending {
	return {
		ts: new Date(),
		outcome: 'pending',
		operation: 'serialize',
		uri: data.uri,
		message() {
			return data.uri;
		},
		timing() {
			return this.finishedTs ? this.finishedTs.getTime() - this.ts.getTime() : NaN;
		},
	};
}
