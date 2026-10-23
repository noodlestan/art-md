import type { DirectoryExtractContext } from '@purrception/source-fs';
import { describe, expect, it } from 'vitest';

import { findIndexFile } from './findIndexFile.js';
import { findModuleEntryFile } from './findModuleEntryFile.js';
import { findModuleSourceFiles } from './findModuleSourceFiles.js';
import { findTypesFile } from './findTypesFile.js';

function makeContext(path: string, files: string[]): DirectoryExtractContext {
	return {
		dirMeta: { path, relative: 'module', files, dirs: [] },
	} as unknown as DirectoryExtractContext;
}

describe('module file resolvers', () => {
	const files = [
		'constants.ts',
		'index.ts',
		'index.test.ts',
		'module.ts',
		'module.test.ts',
		'types.ts',
		'types.d.ts',
	];

	it('WHEN the directory has an index file THEN returns it, ignoring test files', () => {
		expect(findIndexFile(makeContext('/repo/src/module', files))).toBe('index.ts');
	});

	it('WHEN the directory has a types file THEN returns it', () => {
		expect(findTypesFile(makeContext('/repo/src/module', files))).toBe('types.ts');
	});

	it('WHEN the directory is named after a source file THEN returns that file as entry', () => {
		expect(findModuleEntryFile(makeContext('/repo/src/module', files))).toBe('module.ts');
	});

	it('WHEN the directory has no same-name file THEN returns no entry file', () => {
		expect(findModuleEntryFile(makeContext('/repo/src/other', files))).toBeUndefined();
	});

	it('WHEN listing symbol sources THEN includes constants and excludes index and types', () => {
		expect(findModuleSourceFiles(makeContext('/repo/src/module', files))).toEqual([
			'constants.ts',
			'module.ts',
		]);
	});

	it('WHEN custom extensions are given THEN resolves files with those extensions', () => {
		const ctx = makeContext('/repo/src/module', files);

		expect(findIndexFile(ctx, ['.mts'])).toBeUndefined();
		expect(findTypesFile(ctx, ['.mts'])).toBeUndefined();
		expect(findModuleEntryFile(ctx, ['.mts'])).toBeUndefined();
		expect(findModuleSourceFiles(ctx, ['.mts'])).toEqual([]);
	});
});
