import type { RunOperationOptions } from '../../commands/types.js';
import type { CommandContext } from '../../context/types.js';
import type { CommandOutputOptions } from '../programs/types.js';

export type CommandHandler = (
	file: string | undefined,
	options: CommandOutputOptions,
) => Promise<void>;

export type CommandOperation = (
	ctx: CommandContext,
	options: RunOperationOptions,
) => Promise<unknown>;
