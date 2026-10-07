import type { Command } from 'commander';

import { WRITE_OPTION_DESCRIPTION } from './constants';

export function addWriteOption(command: Command): Command {
	return command.option('-w, --write <file>', WRITE_OPTION_DESCRIPTION);
}
