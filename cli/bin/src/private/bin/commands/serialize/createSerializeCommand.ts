import { doSerialize } from '../../../commands/serialize/doSerialize.js';
import type { BinConfig } from '../../../config/types.js';
import { createCommandContext } from '../../../context/createCommandContext.js';
import { createConsoleWriter } from '../../../logger/createConsoleWriter.js';
import { createLogger } from '../../../logger/createLogger.js';
import { validateVerbosity } from '../../../logger/validateVerbosity.js';
import { createGenericOperation } from '../../../operations/createGenericOperation.js';
import { FAILURE_EXIT_CODE } from '../../constants.js';
import type { CommandOutputOptions } from '../../programs/types.js';
import type { CommandHandler } from '../types.js';

export function createSerializeCommand(config: BinConfig): CommandHandler {
	const action = async (file: string | undefined, options: CommandOutputOptions) => {
		const writer = createConsoleWriter(options.write ? 'stdout' : 'stderr');
		const logger = createLogger(writer);
		const verbosity = validateVerbosity(options.output) ? options.output : config.output.mode;
		logger.setVerbosity(verbosity);

		const ctx = createCommandContext(config, logger);
		const op = createGenericOperation('command', ['serialize', { file, write: options.write }]);
		ctx.operations.log(op);

		const outcome = await doSerialize(ctx, { file, write: options.write });
		if (outcome === null) {
			process.exitCode = FAILURE_EXIT_CODE;
		}
	};

	return action as CommandHandler;
}
