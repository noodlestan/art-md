import { doParse } from '../../../commands/parse/doParse';
import type { BinConfig } from '../../../config/types';
import { createCommandContext } from '../../../context/createCommandContext';
import { createConsoleWriter } from '../../../logger/createConsoleWriter';
import { createLogger } from '../../../logger/createLogger';
import { validateVerbosity } from '../../../logger/validateVerbosity';
import { createGenericOperation } from '../../../operations/createGenericOperation';
import { FAILURE_EXIT_CODE } from '../../constants';
import type { CommandOutputOptions } from '../../programs/types';
import type { CommandHandler } from '../types';

export function createParseCommand(config: BinConfig): CommandHandler {
	const action = async (file: string | undefined, options: CommandOutputOptions) => {
		const writer = createConsoleWriter(options.write ? 'stdout' : 'stderr');
		const logger = createLogger(writer);
		const verbosity = validateVerbosity(options.output) ? options.output : config.output.mode;
		logger.setVerbosity(verbosity);

		const ctx = createCommandContext(config, logger);
		const op = createGenericOperation('command', ['parse', { file, write: options.write }]);
		ctx.operations.log(op);

		const outcome = await doParse(ctx, { file, write: options.write });
		if (outcome === null) {
			process.exitCode = FAILURE_EXIT_CODE;
		}
	};

	return action as CommandHandler;
}
