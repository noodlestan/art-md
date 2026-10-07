import { describe, expect, it } from 'vitest';

import { makeConfigFixture } from '../../../../test/helpers/config/makeConfigFixture';

import { buildCodecProgram } from './buildCodecProgram';

describe('buildCodecProgram', () => {
	it('WHEN built from the injected config, reports that config version', () => {
		const config = makeConfigFixture();

		const program = buildCodecProgram(config);

		expect(program.version()).toBe(config.version);
	});

	it('WHEN built, names and describes the art-codec program', () => {
		const program = buildCodecProgram(makeConfigFixture());

		expect(program.name()).toBe('art-codec');
		expect(program.description()).toBe('Parse and serialize Art MD documents.');
	});

	it('WHEN built, registers the parse and serialize commands with their descriptions', () => {
		const program = buildCodecProgram(makeConfigFixture());
		const declared = program.commands.map(command => `${command.name()}: ${command.description()}`);

		expect(declared).toEqual([
			'parse: Parse an Art MD document from markdown.',
			'serialize: Serialize an Art MD document into markdown.',
		]);
	});

	it('WHEN built, takes no file argument or command options of its own', () => {
		const program = buildCodecProgram(makeConfigFixture());
		const flags = program.options.map(option => option.flags);

		expect(program.registeredArguments).toEqual([]);
		expect(flags).toEqual(['-V, --version']);
	});

	it('WHEN built, gives each command a single optional file argument', () => {
		const program = buildCodecProgram(makeConfigFixture());

		for (const command of program.commands) {
			const argument = command.registeredArguments[0];

			expect(command.registeredArguments).toHaveLength(1);
			expect(argument?.name()).toBe('file');
			expect(argument?.required).toBe(false);
		}
	});

	it('WHEN built, gives each command the output and write options only', () => {
		const program = buildCodecProgram(makeConfigFixture());

		for (const command of program.commands) {
			const flags = command.options.map(option => option.flags);

			expect(flags).toEqual(['-o, --output <mode>', '-w, --write <file>']);
		}
	});
});
