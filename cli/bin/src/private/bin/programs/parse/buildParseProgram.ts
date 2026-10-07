import { Command } from 'commander';

import type { BinConfig } from '../../../config/types';
import { createParseCommand } from '../../commands/parse/createParseCommand';
import { addFileArgument } from '../../options/file/addFileArgument';
import { addOutputOption } from '../../options/output/addOutputOption';
import { addWriteOption } from '../../options/write/addWriteOption';

import { PROGRAM_DESCRIPTION, PROGRAM_NAME } from './constants';

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
