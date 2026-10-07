import { describe, expect, it } from 'vitest';

import { makeConfigFixture } from '../../../../test/helpers/config/makeConfigFixture';

import { buildParseProgram } from './buildParseProgram';

describe('buildParseProgram', () => {
	it('WHEN built from the injected config, reports that config version', () => {
		const config = makeConfigFixture();

		const program = buildParseProgram(config);

		expect(program.version()).toBe(config.version);
	});

	it('WHEN built, names and describes the art-parse program', () => {
		const program = buildParseProgram(makeConfigFixture());

		expect(program.name()).toBe('art-parse');
		expect(program.description()).toBe('Parse Art MD markdown into a document.');
	});

	it('WHEN built, declares a single optional file argument', () => {
		const program = buildParseProgram(makeConfigFixture());
		const argument = program.registeredArguments[0];

		expect(program.registeredArguments).toHaveLength(1);
		expect(argument?.name()).toBe('file');
		expect(argument?.required).toBe(false);
	});

	it('WHEN built, declares the version, output and write options only', () => {
		const program = buildParseProgram(makeConfigFixture());
		const flags = program.options.map(option => option.flags);

		expect(flags).toEqual(['-V, --version', '-o, --output <mode>', '-w, --write <file>']);
	});

	it('WHEN built, registers no subcommands', () => {
		const program = buildParseProgram(makeConfigFixture());

		expect(program.commands).toEqual([]);
	});
});
