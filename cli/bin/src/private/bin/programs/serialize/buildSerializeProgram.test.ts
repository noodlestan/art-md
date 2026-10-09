import { describe, expect, it } from 'vitest';

import { makeConfigFixture } from '../../../../test/helpers/config/makeConfigFixture.js';

import { buildSerializeProgram } from './buildSerializeProgram.js';

describe('buildSerializeProgram', () => {
	it('WHEN built from the injected config, reports that config version', () => {
		const config = makeConfigFixture();

		const program = buildSerializeProgram(config);

		expect(program.version()).toBe(config.version);
	});

	it('WHEN built, names and describes the art-serialize program', () => {
		const program = buildSerializeProgram(makeConfigFixture());

		expect(program.name()).toBe('art-serialize');
		expect(program.description()).toBe('Serialize an Art MD document into markdown.');
	});

	it('WHEN built, declares a single optional file argument', () => {
		const program = buildSerializeProgram(makeConfigFixture());
		const argument = program.registeredArguments[0];

		expect(program.registeredArguments).toHaveLength(1);
		expect(argument?.name()).toBe('file');
		expect(argument?.required).toBe(false);
	});

	it('WHEN built, declares the version, output and write options only', () => {
		const program = buildSerializeProgram(makeConfigFixture());
		const flags = program.options.map(option => option.flags);

		expect(flags).toEqual(['-V, --version', '-o, --output <mode>', '-w, --write <file>']);
	});

	it('WHEN built, registers no subcommands', () => {
		const program = buildSerializeProgram(makeConfigFixture());

		expect(program.commands).toEqual([]);
	});
});
