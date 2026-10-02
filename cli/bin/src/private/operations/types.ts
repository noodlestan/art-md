export type OperationOutcome = 'pending' | 'success' | 'failure';

export type OperationBase = {
	operation: string;
	ts: Date; // created when the pending operation is logged
	finishedTs?: Date; // set when the operation resolves (success/failure)
	outcome: OperationOutcome;
	message: () => string;
	timing: () => number; // finishedTs ? finishedTs.getTime() - ts.getTime() : NaN
};

export type OperationPending = OperationBase & {
	outcome: 'pending';
	data?: unknown;
};

export type OperationSuccess = OperationBase & {
	outcome: 'success';
	data?: unknown;
};

export type OperationFailure = OperationBase & {
	outcome: 'failure';
	error: string;
	errorSerialized: () => string;
	data?: unknown;
};

export type ParsePending = OperationPending & {
	operation: 'parse';
	uri: string;
};

export type SerializePending = OperationPending & {
	operation: 'serialize';
	uri: string;
};

export type Operation =
	| ParsePending
	| SerializePending
	| OperationPending
	| OperationSuccess
	| OperationFailure;
