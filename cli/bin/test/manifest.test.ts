import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

const PACKAGE_ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const MANIFEST_PATH = join(PACKAGE_ROOT, 'package.json');
const ENTRY_POINT_DIRECTORY = join(PACKAGE_ROOT, 'src', 'bin');
const COMMAND_PREFIX = 'art-';
const SHEBANG = '#!/usr/bin/env node';
const COMMAND_NAMES = ['art-codec', 'art-parse', 'art-serialize'];

type BinManifest = {
	bin: Record<string, string>;
};

function readBinManifest(): BinManifest {
	const contents = readFileSync(MANIFEST_PATH, 'utf8');
	return JSON.parse(contents) as BinManifest;
}

function getEntryPointName(commandName: string): string {
	return commandName.replace(COMMAND_PREFIX, '');
}

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
