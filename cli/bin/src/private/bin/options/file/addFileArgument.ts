import type { Command } from 'commander';

import { FILE_ARGUMENT_DESCRIPTION } from './constants.js';

export function addFileArgument(command: Command): Command {
	return command.argument('[file]', FILE_ARGUMENT_DESCRIPTION);
}
