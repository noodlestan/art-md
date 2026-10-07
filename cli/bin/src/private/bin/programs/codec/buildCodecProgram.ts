import { Command } from 'commander';

import type { BinConfig } from '../../../config/types';
import { createParseCommand } from '../../commands/parse/createParseCommand';
import { createSerializeCommand } from '../../commands/serialize/createSerializeCommand';
import { addFileArgument } from '../../options/file/addFileArgument';
import { addOutputOption } from '../../options/output/addOutputOption';
import { addWriteOption } from '../../options/write/addWriteOption';

import {
	PARSE_COMMAND_DESCRIPTION,
	PARSE_COMMAND_NAME,
	PROGRAM_DESCRIPTION,
	PROGRAM_NAME,
	SERIALIZE_COMMAND_DESCRIPTION,
	SERIALIZE_COMMAND_NAME,
} from './constants';

export function buildCodecProgram(config: BinConfig): Command {
	const program = new Command();

	program.name(PROGRAM_NAME);
	program.description(PROGRAM_DESCRIPTION);
	program.version(config.version);

	const parse = program.command(PARSE_COMMAND_NAME);
	parse.description(PARSE_COMMAND_DESCRIPTION);
	addOutputOption(parse);
	addFileArgument(parse);
	addWriteOption(parse);
	parse.action(createParseCommand(config));

	const serialize = program.command(SERIALIZE_COMMAND_NAME);
	serialize.description(SERIALIZE_COMMAND_DESCRIPTION);
	addOutputOption(serialize);
	addFileArgument(serialize);
	addWriteOption(serialize);
	serialize.action(createSerializeCommand(config));

	return program;
}
