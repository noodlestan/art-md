import { Command } from 'commander';

import { loadBinConfig } from '../config/loadBinConfig';

import type { ProgramSpec } from './types';

export function buildProgram(spec: ProgramSpec): Command {
	const { name, description, commands } = spec;
	const config = loadBinConfig();
	const program = new Command();

	program.name(name).description(description).version(config.version);

	for (const command of commands) {
		program.addCommand(command);
	}

	return program;
}
