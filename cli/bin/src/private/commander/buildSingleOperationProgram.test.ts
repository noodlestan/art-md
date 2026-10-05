import { describe, expect, it, vi } from 'vitest';

import { loadBinConfig } from '../config/loadBinConfig';

import { buildSingleOperationProgram } from './buildSingleOperationProgram';
import type { SingleOperationSpec } from './types';

const PROGRAM_NAME = 'art-test';
const PROGRAM_DESCRIPTION = 'Test program.';

function makeSpec(overrides: Partial<SingleOperationSpec> = {}): SingleOperationSpec {
	return {
		name: PROGRAM_NAME,
		description: PROGRAM_DESCRIPTION,
		configure: vi.fn(),
		run: vi.fn().mockResolvedValue(undefined),
		...overrides,
	};
}

describe('buildSingleOperationProgram', () => {
	it('WHEN built, reports the given name and description', () => {
		const program = buildSingleOperationProgram(makeSpec());

		expect(program.name()).toBe(PROGRAM_NAME);
		expect(program.description()).toBe(PROGRAM_DESCRIPTION);
	});

	it('WHEN built, reports the given name in the help output', () => {
		const program = buildSingleOperationProgram(makeSpec());

		expect(program.helpInformation()).toContain(`Usage: ${PROGRAM_NAME}`);
	});

	it('WHEN built, reports the bin package version', () => {
		const config = loadBinConfig();
		const program = buildSingleOperationProgram(makeSpec());

		expect(config.version).toMatch(/^\d+\.\d+\.\d+/);
		expect(program.version()).toBe(config.version);
	});

	it('WHEN built, registers no subcommands', () => {
		const program = buildSingleOperationProgram(makeSpec());

		expect(program.commands).toEqual([]);
		expect(program.helpInformation()).not.toContain('Commands:');
	});

	it('WHEN built, applies the given configuration to itself', () => {
		const configure = vi.fn();
		const program = buildSingleOperationProgram(makeSpec({ configure }));

		expect(configure).toHaveBeenCalledWith(program);
	});

	it('WHEN parsed with arguments, runs the given operation against them', async () => {
		const run = vi.fn().mockResolvedValue(undefined);
		const program = buildSingleOperationProgram(
			makeSpec({
				configure: command => command.argument('[file]'),
				run,
			}),
		);

		await program.parseAsync(['input.md'], { from: 'user' });

		expect(run).toHaveBeenCalledWith('input.md', expect.anything(), program);
	});
});
