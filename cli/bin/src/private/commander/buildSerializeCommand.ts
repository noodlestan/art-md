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

export function configureSerializeCommand(command: Command): void {
	command
		.argument('[file]', FILE_ARGUMENT_DESCRIPTION)
		.option('-o, --output <mode>', OUTPUT_OPTION_DESCRIPTION)
		.option('-w, --write <file>', WRITE_OPTION_DESCRIPTION);
}

export async function runSerializeCommand(
	file: string | undefined,
	options: CommandOutputOptions,
): Promise<void> {
	const ctx = createCommandContext(options.output);
	const outcome = await runSerialize(ctx, { file, write: options.write });
	setExitCodeOnFailure(outcome);
}

export function buildSerializeCommand(): Command {
	const command = new Command(COMMAND_NAME);

	command.description(COMMAND_DESCRIPTION);
	configureSerializeCommand(command);
	command.action(runSerializeCommand);

	return command;
}
