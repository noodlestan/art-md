import { Command } from 'commander';
import { describe, expect, it } from 'vitest';

import { loadBinConfig } from '../config/loadBinConfig';

import { buildProgram } from './buildProgram';
import type { ProgramSpec } from './types';

const PROGRAM_NAME = 'art-test';
const PROGRAM_DESCRIPTION = 'Test program.';

function makeSpec(commands: Command[] = []): ProgramSpec {
	return { name: PROGRAM_NAME, description: PROGRAM_DESCRIPTION, commands };
}

describe('buildProgram', () => {
	it('WHEN built, reports the given name and description', () => {
		const program = buildProgram(makeSpec());

		expect(program.name()).toBe(PROGRAM_NAME);
		expect(program.description()).toBe(PROGRAM_DESCRIPTION);
	});

	it('WHEN built, reports the given name in the help output', () => {
		const program = buildProgram(makeSpec());

		expect(program.helpInformation()).toContain(`Usage: ${PROGRAM_NAME}`);
	});

	it('WHEN built, reports the bin package version', () => {
		const config = loadBinConfig();
		const program = buildProgram(makeSpec());

		expect(config.version).toMatch(/^\d+\.\d+\.\d+/);
		expect(program.version()).toBe(config.version);
	});

	it('WHEN built, registers the given commands', () => {
		const parse = new Command('parse');
		const serialize = new Command('serialize');
		const program = buildProgram(makeSpec([parse, serialize]));

		const names = program.commands.map(command => command.name());

		expect(names).toEqual(['parse', 'serialize']);
		expect(program.commands[0]).toBe(parse);
	});

	it('WHEN built without commands, registers none', () => {
		const program = buildProgram(makeSpec());

		expect(program.commands).toEqual([]);
	});
});
