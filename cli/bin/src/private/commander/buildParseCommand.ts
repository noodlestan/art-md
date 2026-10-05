import { Command } from 'commander';

import { runParse } from '../../commands/parse/runParse';

import { createCommandContext } from './private/createCommandContext';
import { setExitCodeOnFailure } from './private/setExitCodeOnFailure';
import {
	type CommandOutputOptions,
	FILE_ARGUMENT_DESCRIPTION,
	OUTPUT_OPTION_DESCRIPTION,
	WRITE_OPTION_DESCRIPTION,
} from './types';

const COMMAND_NAME = 'parse';
const COMMAND_DESCRIPTION = 'Parse an Art MD document from markdown.';

export function configureParseCommand(command: Command): void {
	command
		.argument('[file]', FILE_ARGUMENT_DESCRIPTION)
		.option('-o, --output <mode>', OUTPUT_OPTION_DESCRIPTION)
		.option('-w, --write <file>', WRITE_OPTION_DESCRIPTION);
}

export async function runParseCommand(
	file: string | undefined,
	options: CommandOutputOptions,
): Promise<void> {
	const ctx = createCommandContext(options.output);
	const outcome = await runParse(ctx, { file, write: options.write });
	setExitCodeOnFailure(outcome);
}

export function buildParseCommand(): Command {
	const command = new Command(COMMAND_NAME);

	command.description(COMMAND_DESCRIPTION);
	configureParseCommand(command);
	command.action(runParseCommand);

	return command;
}
