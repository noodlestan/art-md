import type { CommandContext } from '../context/types.js';
import type { OperationPending } from '../operations/types.js';

export type RunOperationOptions = {
	file?: string;
	write?: string;
};

export type OperationRun<TResult> = {
	result: TResult;
	output: string;
};

export type CreateOperation = (data: { uri: string }) => OperationPending;

export type ExecuteOperation<TResult> = (
	ctx: CommandContext,
	source: string,
) => OperationRun<TResult>;
