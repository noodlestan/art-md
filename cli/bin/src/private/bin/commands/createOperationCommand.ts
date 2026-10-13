import type { BinConfig } from '../../config/types.js';
import { createCommandContext } from '../../context/createCommandContext.js';
import { createConsoleWriter } from '../../logger/createConsoleWriter.js';
import { createLogger } from '../../logger/createLogger.js';
import { createGenericOperation } from '../../operations/createGenericOperation.js';
import { FAILURE_EXIT_CODE } from '../constants.js';
import type { CommandOutputOptions } from '../programs/types.js';

import { resolveVerbosity } from './private/resolveVerbosity.js';
import type { CommandHandler, CommandOperation } from './types.js';

export function createOperationCommand(
	config: BinConfig,
	commandName: string,
	executeOperation: CommandOperation,
): CommandHandler {
	async function action(file: string | undefined, options: CommandOutputOptions): Promise<void> {
		const writer = createConsoleWriter(options.write ? 'stdout' : 'stderr');
		const logger = createLogger(writer);
		const verbosity = resolveVerbosity(config.output.mode, options.output);
		logger.setVerbosity(verbosity);

		const ctx = createCommandContext(config, logger);
		const operationOptions = { file, write: options.write };
		const commandArguments = [commandName, operationOptions];
		const commandOperation = createGenericOperation('command', commandArguments);
		ctx.operations.log(commandOperation);

		const outcome = await executeOperation(ctx, operationOptions);
		if (outcome === null) {
			process.exitCode = FAILURE_EXIT_CODE;
		}
	}

	return action;
}
