import { doParse } from '../../../commands/parse/doParse.js';
import type { BinConfig } from '../../../config/types.js';
import { createOperationCommand } from '../createOperationCommand.js';
import type { CommandHandler } from '../types.js';

export function createParseCommand(config: BinConfig): CommandHandler {
	return createOperationCommand(config, 'parse', doParse);
}
