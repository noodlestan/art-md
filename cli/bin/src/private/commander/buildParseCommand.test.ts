import { describe, expect, it, vi } from 'vitest';

import { makeCodecContextMock } from '../../test/helpers/makeCodecContextMock';

import { buildParseCommand } from './buildParseCommand';

const COMMAND_NAME = 'parse';
const COMMAND_DESCRIPTION = 'Parse an Art MD document from markdown.';
const OPTION_FLAGS = ['-o, --output <mode>', '--json', '-w, --write <file>'];

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

	it('WHEN built, declares the output, json and write options', () => {
		const command = buildParseCommand();

		const flags = command.options.map(option => option.flags);

		expect(flags).toEqual(OPTION_FLAGS);
	});

	it('WHEN parsed with arguments, runs the parse operation against them', async () => {
		const ctx = makeCodecContextMock();
		mocks.createCommandContext.mockReturnValue(ctx);
		const command = buildParseCommand();

		await command.parseAsync(['input.md', '-o', 'verbose', '--json', '-w', 'out.json'], {
			from: 'user',
		});

		expect(mocks.createCommandContext).toHaveBeenCalledWith('verbose');
		expect(mocks.runParse).toHaveBeenCalledWith(ctx, {
			file: 'input.md',
			json: true,
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
			json: undefined,
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
			json: undefined,
			write: undefined,
		});
	});
});
