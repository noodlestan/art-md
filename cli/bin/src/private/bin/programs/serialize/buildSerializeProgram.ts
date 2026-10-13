import { Command } from 'commander';

import type { BinConfig } from '../../../config/types.js';
import { createSerializeCommand } from '../../commands/serialize/createSerializeCommand.js';
import { addCommandOptions } from '../../options/addCommandOptions.js';

import { PROGRAM_DESCRIPTION, PROGRAM_NAME } from './constants.js';

export function buildSerializeProgram(config: BinConfig): Command {
	const program = new Command();

	program.name(PROGRAM_NAME);
	program.description(PROGRAM_DESCRIPTION);
	program.version(config.version);

	addCommandOptions(program);

	program.action(createSerializeCommand(config));

	return program;
}
