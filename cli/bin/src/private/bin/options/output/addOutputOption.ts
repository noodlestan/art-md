import type { Command } from 'commander';

import { OUTPUT_OPTION_DESCRIPTION } from './constants.js';

export function addOutputOption(command: Command): Command {
	return command.option('-o, --output <mode>', OUTPUT_OPTION_DESCRIPTION);
}
