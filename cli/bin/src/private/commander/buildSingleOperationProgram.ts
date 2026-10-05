import { Command } from 'commander';

import { loadBinConfig } from '../config/loadBinConfig';

import type { SingleOperationSpec } from './types';

export function buildSingleOperationProgram(spec: SingleOperationSpec): Command {
	const config = loadBinConfig();
	const program = new Command();

	program.name(spec.name).description(spec.description).version(config.version);
	spec.configure(program);
	program.action(spec.run);

	return program;
}
