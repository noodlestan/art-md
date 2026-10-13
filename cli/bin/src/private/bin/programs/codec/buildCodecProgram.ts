import { Command } from 'commander';

import type { BinConfig } from '../../../config/types.js';
import { createParseCommand } from '../../commands/parse/createParseCommand.js';
import { createSerializeCommand } from '../../commands/serialize/createSerializeCommand.js';
import { addCommandOptions } from '../../options/addCommandOptions.js';

import {
	PARSE_COMMAND_DESCRIPTION,
	PARSE_COMMAND_NAME,
	PROGRAM_DESCRIPTION,
	PROGRAM_NAME,
	SERIALIZE_COMMAND_DESCRIPTION,
	SERIALIZE_COMMAND_NAME,
} from './constants.js';

export function buildCodecProgram(config: BinConfig): Command {
	const program = new Command();

	program.name(PROGRAM_NAME);
	program.description(PROGRAM_DESCRIPTION);
	program.version(config.version);

	const parse = program.command(PARSE_COMMAND_NAME);
	parse.description(PARSE_COMMAND_DESCRIPTION);
	addCommandOptions(parse);
	parse.action(createParseCommand(config));

	const serialize = program.command(SERIALIZE_COMMAND_NAME);
	serialize.description(SERIALIZE_COMMAND_DESCRIPTION);
	addCommandOptions(serialize);
	serialize.action(createSerializeCommand(config));

	return program;
}
