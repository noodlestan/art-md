import { doSerialize } from '../../../commands/serialize/doSerialize.js';
import type { BinConfig } from '../../../config/types.js';
import { createOperationCommand } from '../createOperationCommand.js';
import type { CommandHandler } from '../types.js';

export function createSerializeCommand(config: BinConfig): CommandHandler {
	return createOperationCommand(config, 'serialize', doSerialize);
}
