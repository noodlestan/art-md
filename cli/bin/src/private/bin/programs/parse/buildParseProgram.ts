import { Command } from 'commander';

import type { BinConfig } from '../../../config/types.js';
import { createParseCommand } from '../../commands/parse/createParseCommand.js';
import { addFileArgument } from '../../options/file/addFileArgument.js';
import { addOutputOption } from '../../options/output/addOutputOption.js';
import { addWriteOption } from '../../options/write/addWriteOption.js';

import { PROGRAM_DESCRIPTION, PROGRAM_NAME } from './constants.js';

export function buildParseProgram(config: BinConfig): Command {
	const program = new Command();

	program.name(PROGRAM_NAME);
	program.description(PROGRAM_DESCRIPTION);
	program.version(config.version);

	addOutputOption(program);
	addFileArgument(program);
	addWriteOption(program);

	program.action(createParseCommand(config));

	return program;
}
