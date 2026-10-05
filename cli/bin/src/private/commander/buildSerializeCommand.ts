import { Command } from 'commander';

import { runSerialize } from '../../commands/serialize/runSerialize';

import { createCommandContext } from './private/createCommandContext';
import { setExitCodeOnFailure } from './private/setExitCodeOnFailure';
import {
	type CommandOutputOptions,
	FILE_ARGUMENT_DESCRIPTION,
	OUTPUT_OPTION_DESCRIPTION,
	WRITE_OPTION_DESCRIPTION,
} from './types';

const COMMAND_NAME = 'serialize';
const COMMAND_DESCRIPTION = 'Serialize an Art MD document into markdown.';

export function buildSerializeCommand(): Command {
	const command = new Command(COMMAND_NAME);

	command
		.description(COMMAND_DESCRIPTION)
		.argument('[file]', FILE_ARGUMENT_DESCRIPTION)
		.option('-o, --output <mode>', OUTPUT_OPTION_DESCRIPTION)
		.option('-w, --write <file>', WRITE_OPTION_DESCRIPTION)
		.action(async (file: string | undefined, options: CommandOutputOptions) => {
			const ctx = createCommandContext(options.output);
			const serializeOptions = { file, write: options.write };
			const outcome = await runSerialize(ctx, serializeOptions);
			setExitCodeOnFailure(outcome);
		});

	return command;
}
