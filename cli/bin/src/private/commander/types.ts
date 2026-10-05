import type { Command } from 'commander';

export const FILE_ARGUMENT_DESCRIPTION = 'path to the input file, or - to read stdin';
export const OUTPUT_OPTION_DESCRIPTION = 'One of quiet|verbose';
export const WRITE_OPTION_DESCRIPTION = 'write the result to a file instead of stdout';

export type CommandOutputOptions = {
	output?: string;
	write?: string;
};

export type SingleOperationSpec = {
	name: string;
	description: string;
	configure: (command: Command) => void;
	run: (file: string | undefined, options: CommandOutputOptions) => Promise<void>;
};

export type ProgramSpec = {
	name: string;
	description: string;
	commands: Command[];
};
