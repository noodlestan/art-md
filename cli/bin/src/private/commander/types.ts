import type { Command } from 'commander';

export const FILE_ARGUMENT_DESCRIPTION = 'path to the input file, or - to read stdin';
export const OUTPUT_OPTION_DESCRIPTION = 'One of quiet|verbose';
export const WRITE_OPTION_DESCRIPTION = 'write the result to a file instead of stdout';

export type CommandOutputOptions = {
	output?: string;
	write?: string;
};

export type ParseCommandOptions = CommandOutputOptions & {
	json?: boolean;
};

export type ProgramSpec = {
	name: string;
	description: string;
	commands: Command[];
};
