import { describe, expect, it, vi } from 'vitest';

import { makeCodecContextMock } from '../../test/helpers/makeCodecContextMock';

import { buildSerializeCommand } from './buildSerializeCommand';

const COMMAND_NAME = 'serialize';
const COMMAND_DESCRIPTION = 'Serialize an Art MD document into markdown.';
const OPTION_FLAGS = ['-o, --output <mode>', '-w, --write <file>'];

const mocks = vi.hoisted(() => ({
	createCommandContext: vi.fn(),
	runSerialize: vi.fn(),
}));

vi.mock('./private/createCommandContext', () => ({
	createCommandContext: mocks.createCommandContext,
}));

vi.mock('../../commands/serialize/runSerialize', () => ({
	runSerialize: mocks.runSerialize,
}));

describe('buildSerializeCommand', () => {
	it('WHEN built, is the serialize command', () => {
		const command = buildSerializeCommand();

		expect(command.name()).toBe(COMMAND_NAME);
		expect(command.description()).toBe(COMMAND_DESCRIPTION);
	});

	it('WHEN built, declares a single optional file argument', () => {
		const command = buildSerializeCommand();

		const argument = command.registeredArguments[0];

		expect(command.registeredArguments).toHaveLength(1);
		expect(argument?.name()).toBe('file');
		expect(argument?.required).toBe(false);
		expect(argument?.description).toContain('- to read stdin');
	});

	it('WHEN built, declares the output and write options only', () => {
		const command = buildSerializeCommand();

		const flags = command.options.map(option => option.flags);

		expect(flags).toEqual(OPTION_FLAGS);
	});

	it('WHEN parsed with arguments, runs the serialize operation against them', async () => {
		const ctx = makeCodecContextMock();
		mocks.createCommandContext.mockReturnValue(ctx);
		const command = buildSerializeCommand();

		await command.parseAsync(['input.json', '-o', 'verbose', '-w', 'out.md'], { from: 'user' });

		expect(mocks.createCommandContext).toHaveBeenCalledWith('verbose');
		expect(mocks.runSerialize).toHaveBeenCalledWith(ctx, {
			file: 'input.json',
			write: 'out.md',
		});
	});

	it('WHEN parsed without arguments, runs the serialize operation without them', async () => {
		const ctx = makeCodecContextMock();
		mocks.createCommandContext.mockReturnValue(ctx);
		const command = buildSerializeCommand();

		await command.parseAsync([], { from: 'user' });

		expect(mocks.createCommandContext).toHaveBeenCalledWith(undefined);
		expect(mocks.runSerialize).toHaveBeenCalledWith(ctx, {
			file: undefined,
			write: undefined,
		});
	});

	it('WHEN parsed with a dash, runs the serialize operation against stdin', async () => {
		const ctx = makeCodecContextMock();
		mocks.createCommandContext.mockReturnValue(ctx);
		const command = buildSerializeCommand();

		await command.parseAsync(['-'], { from: 'user' });

		expect(mocks.runSerialize).toHaveBeenCalledWith(ctx, {
			file: '-',
			write: undefined,
		});
	});
});
