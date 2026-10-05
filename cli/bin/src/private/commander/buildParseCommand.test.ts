import process from 'node:process';

import { afterEach, describe, expect, it, vi } from 'vitest';

import { makeCodecContextMock } from '../../test/helpers/makeCodecContextMock';

import { buildParseCommand } from './buildParseCommand';

const COMMAND_NAME = 'parse';
const COMMAND_DESCRIPTION = 'Parse an Art MD document from markdown.';
const OPTION_FLAGS = ['-o, --output <mode>', '-w, --write <file>'];
const FAILURE_EXIT_CODE = 1;
const UNSET_EXIT_CODE = 0;

const mocks = vi.hoisted(() => ({
	createCommandContext: vi.fn(),
	runParse: vi.fn(),
}));

vi.mock('./private/createCommandContext', () => ({
	createCommandContext: mocks.createCommandContext,
}));

vi.mock('../../commands/parse/runParse', () => ({
	runParse: mocks.runParse,
}));

afterEach(() => {
	process.exitCode = UNSET_EXIT_CODE;
});

describe('buildParseCommand', () => {
	it('WHEN built, is the parse command', () => {
		const command = buildParseCommand();

		expect(command.name()).toBe(COMMAND_NAME);
		expect(command.description()).toBe(COMMAND_DESCRIPTION);
	});

	it('WHEN built, declares a single optional file argument', () => {
		const command = buildParseCommand();

		const argument = command.registeredArguments[0];

		expect(command.registeredArguments).toHaveLength(1);
		expect(argument?.name()).toBe('file');
		expect(argument?.required).toBe(false);
		expect(argument?.description).toContain('- to read stdin');
	});

	it('WHEN built, declares the output and write options only', () => {
		const command = buildParseCommand();

		const flags = command.options.map(option => option.flags);

		expect(flags).toEqual(OPTION_FLAGS);
	});

	it('WHEN parsed with arguments, runs the parse operation against them', async () => {
		const ctx = makeCodecContextMock();
		mocks.createCommandContext.mockReturnValue(ctx);
		const command = buildParseCommand();

		await command.parseAsync(['input.md', '-o', 'verbose', '-w', 'out.json'], { from: 'user' });

		expect(mocks.createCommandContext).toHaveBeenCalledWith('verbose');
		expect(mocks.runParse).toHaveBeenCalledWith(ctx, {
			file: 'input.md',
			write: 'out.json',
		});
	});

	it('WHEN parsed without arguments, runs the parse operation without them', async () => {
		const ctx = makeCodecContextMock();
		mocks.createCommandContext.mockReturnValue(ctx);
		const command = buildParseCommand();

		await command.parseAsync([], { from: 'user' });

		expect(mocks.createCommandContext).toHaveBeenCalledWith(undefined);
		expect(mocks.runParse).toHaveBeenCalledWith(ctx, {
			file: undefined,
			write: undefined,
		});
	});

	it('WHEN parsed with a dash, runs the parse operation against stdin', async () => {
		const ctx = makeCodecContextMock();
		mocks.createCommandContext.mockReturnValue(ctx);
		const command = buildParseCommand();

		await command.parseAsync(['-'], { from: 'user' });

		expect(mocks.runParse).toHaveBeenCalledWith(ctx, {
			file: '-',
			write: undefined,
		});
	});

	it('GIVEN a failed operation, exits with a non-zero code', async () => {
		const ctx = makeCodecContextMock();
		mocks.createCommandContext.mockReturnValue(ctx);
		mocks.runParse.mockResolvedValue(null);
		const command = buildParseCommand();

		await command.parseAsync(['input.md'], { from: 'user' });

		expect(process.exitCode).toBe(FAILURE_EXIT_CODE);
	});
});
