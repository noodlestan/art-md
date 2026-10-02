import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { Command } from 'commander';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';

import { loadBinConfig } from '../private/config/loadBinConfig';

const PACKAGE_ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const MANIFEST_PATH = join(PACKAGE_ROOT, 'package.json');
const ENTRY_POINT_DIRECTORY = join(PACKAGE_ROOT, 'src', 'bin');
const COMMAND_PREFIX = 'art-';
const SHEBANG = '#!/usr/bin/env node';
const COMMAND_NAMES = ['art-codec', 'art-parse', 'art-serialize'];

type BinManifest = {
	bin: Record<string, string>;
};

const parseSpy = vi.spyOn(Command.prototype, 'parse').mockReturnThis();

function readBinManifest(): BinManifest {
	const contents = readFileSync(MANIFEST_PATH, 'utf8');
	return JSON.parse(contents) as BinManifest;
}

function getEntryPointName(commandName: string): string {
	return commandName.replace(COMMAND_PREFIX, '');
}

function isCommand(instance: unknown): instance is Command {
	return instance instanceof Command;
}

function getParsedProgram(index: number): Command {
	const instance = parseSpy.mock.instances[index];
	if (!isCommand(instance)) {
		throw new Error(`No entry point parsed a program at index ${index}`);
	}
	return instance;
}

function getRegisteredNames(program: Command): string[] {
	return program.commands.map(command => command.name());
}

function getRegisteredCommand(program: Command, name: string): Command {
	const command = program.commands.find(registered => registered.name() === name);
	if (command === undefined) {
		throw new Error(`${program.name()} registers no ${name} command`);
	}
	return command;
}

function getSpecHelp(command: Command): string {
	const lines = command.helpInformation().split('\n');
	return lines.slice(1).join('\n');
}

beforeAll(async () => {
	await import('./codec');
	await import('./parse');
	await import('./serialize');
});

afterAll(() => {
	vi.restoreAllMocks();
});

describe('bin manifest', () => {
	it('GIVEN the manifest declares the three CLI commands', () => {
		const manifest = readBinManifest();

		const commandNames = Object.keys(manifest.bin).sort();

		expect(commandNames).toEqual(COMMAND_NAMES);
	});

	for (const commandName of COMMAND_NAMES) {
		it(`GIVEN ${commandName} targets the bundle emitted for its source entry point`, () => {
			const manifest = readBinManifest();

			const entryPointName = getEntryPointName(commandName);
			const target = manifest.bin[commandName];
			const entryPointPath = join(ENTRY_POINT_DIRECTORY, `${entryPointName}.ts`);

			expect(target).toBe(`./dist/${entryPointName}.mjs`);
			expect(existsSync(entryPointPath)).toBe(true);
			expect(readFileSync(entryPointPath, 'utf8').startsWith(SHEBANG)).toBe(true);
		});
	}
});

describe('bin entry points', () => {
	it('WHEN art-codec is loaded, parses a program exposing both commands', () => {
		const program = getParsedProgram(0);

		expect(program.name()).toBe('art-codec');
		expect(program.version()).toBe(loadBinConfig().version);
		expect(getRegisteredNames(program)).toEqual(['parse', 'serialize']);
	});

	it('WHEN art-parse is loaded, parses a program exposing exactly one command', () => {
		const program = getParsedProgram(1);

		expect(program.name()).toBe('art-parse');
		expect(program.version()).toBe(loadBinConfig().version);
		expect(getRegisteredNames(program)).toEqual(['parse']);
	});

	it('WHEN art-serialize is loaded, parses a program exposing exactly one command', () => {
		const program = getParsedProgram(2);

		expect(program.name()).toBe('art-serialize');
		expect(program.version()).toBe(loadBinConfig().version);
		expect(getRegisteredNames(program)).toEqual(['serialize']);
	});

	it('GIVEN the codec bin, its parse command is the spec the parse bin registers', () => {
		const codecProgram = getParsedProgram(0);
		const parseProgram = getParsedProgram(1);

		const codecParse = getRegisteredCommand(codecProgram, 'parse');
		const parseOnly = getRegisteredCommand(parseProgram, 'parse');

		expect(getSpecHelp(codecParse)).toBe(getSpecHelp(parseOnly));
		expect(codecParse.parent?.name()).toBe('art-codec');
		expect(parseOnly.parent?.name()).toBe('art-parse');
	});

	it('GIVEN the codec bin, its serialize command is the spec the serialize bin registers', () => {
		const codecProgram = getParsedProgram(0);
		const serializeProgram = getParsedProgram(2);

		const codecSerialize = getRegisteredCommand(codecProgram, 'serialize');
		const serializeOnly = getRegisteredCommand(serializeProgram, 'serialize');

		expect(getSpecHelp(codecSerialize)).toBe(getSpecHelp(serializeOnly));
		expect(codecSerialize.parent?.name()).toBe('art-codec');
		expect(serializeOnly.parent?.name()).toBe('art-serialize');
	});
});
