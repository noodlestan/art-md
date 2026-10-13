import type { Command } from 'commander';

import { addFileArgument } from './file/addFileArgument.js';
import { addOutputOption } from './output/addOutputOption.js';
import { addWriteOption } from './write/addWriteOption.js';

export function addCommandOptions(command: Command): Command {
	addOutputOption(command);
	addFileArgument(command);
	addWriteOption(command);

	return command;
}
