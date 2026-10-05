import { Command } from 'commander';

import { runParse } from '../../commands/parse/runParse';

import { createCommandContext } from './private/createCommandContext';
import { setExitCodeOnFailure } from './private/setExitCodeOnFailure';
import {
	FILE_ARGUMENT_DESCRIPTION,
	OUTPUT_OPTION_DESCRIPTION,
	type ParseCommandOptions,
	WRITE_OPTION_DESCRIPTION,
} from './types';

const COMMAND_NAME = 'parse';
const COMMAND_DESCRIPTION = 'Parse an Art MD document from markdown.';
const JSON_OPTION_DESCRIPTION = 'present the document as JSON';

export function buildParseCommand(): Command {
	const command = new Command(COMMAND_NAME);

	command
		.description(COMMAND_DESCRIPTION)
		.argument('[file]', FILE_ARGUMENT_DESCRIPTION)
		.option('-o, --output <mode>', OUTPUT_OPTION_DESCRIPTION)
		.option('--json', JSON_OPTION_DESCRIPTION)
		.option('-w, --write <file>', WRITE_OPTION_DESCRIPTION)
		.action(async (file: string | undefined, options: ParseCommandOptions) => {
			const ctx = createCommandContext(options.output);
			const parseOptions = { file, json: options.json, write: options.write };
			const outcome = await runParse(ctx, parseOptions);
			setExitCodeOnFailure(outcome);
		});

	return command;
}
