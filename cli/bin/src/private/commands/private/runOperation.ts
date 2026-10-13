import type { CommandContext } from '../../context/types.js';
import { createOperationFailure } from '../../operations/createOperationFailure.js';
import { createOperationSuccess } from '../../operations/createOperationSuccess.js';
import type { CreateOperation, ExecuteOperation, RunOperationOptions } from '../types.js';

const STDIN_URI = 'stdin';

export async function runOperation<TResult>(
	ctx: CommandContext,
	options: RunOperationOptions,
	createOperation: CreateOperation,
	execute: ExecuteOperation<TResult>,
): Promise<TResult | null> {
	const uri = options.file ?? STDIN_URI;
	const operationData = { uri };
	const pending = createOperation(operationData);
	ctx.operations.log(pending);

	try {
		const source = await ctx.io.readInput(options.file);
		const execution = execute(ctx, source);
		ctx.operations.log(createOperationSuccess(pending));
		await ctx.io.writeOutput(execution.output, options.write);
		return execution.result;
	} catch (error) {
		ctx.operations.log(createOperationFailure(pending, error));
		return null;
	}
}
