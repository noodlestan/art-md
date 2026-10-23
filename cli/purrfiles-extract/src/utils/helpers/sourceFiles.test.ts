import type { DirectoryExtractContext } from '@purrception/source-fs';
import { describe, expect, it } from 'vitest';

import { getFileStem, getSourceFiles, isSourceFile } from './sourceFiles.js';

function makeContext(files: string[]): DirectoryExtractContext {
	return {
		dirMeta: { path: '/repo/src/module', relative: 'module', files, dirs: [] },
	} as unknown as DirectoryExtractContext;
}

describe('sourceFiles', () => {
	it('WHEN the extension is a TypeScript source extension THEN reads the file', () => {
		expect(isSourceFile('module.ts')).toBe(true);
		expect(isSourceFile('module.tsx')).toBe(true);
		expect(isSourceFile('module.mts')).toBe(true);
		expect(isSourceFile('module.cts')).toBe(true);
	});

	it('WHEN the extension is not supported THEN skips the file', () => {
		expect(isSourceFile('module.js')).toBe(false);
		expect(isSourceFile('module.md')).toBe(false);
	});

	it('WHEN the file has no extension THEN skips the file', () => {
		expect(isSourceFile('module')).toBe(false);
		expect(isSourceFile('.ts')).toBe(false);
	});

	it('WHEN the file is a test or declaration file THEN skips the file', () => {
		expect(isSourceFile('module.test.ts')).toBe(false);
		expect(isSourceFile('module.d.ts')).toBe(false);
	});

	it('WHEN custom extensions are given THEN only those extensions are read', () => {
		expect(isSourceFile('module.mts', ['.mts'])).toBe(true);
		expect(isSourceFile('module.ts', ['.mts'])).toBe(false);
	});

	it('WHEN listing source files THEN returns every readable file', () => {
		const ctx = makeContext(['module.ts', 'module.test.ts', 'notes.md', 'types.mts']);

		expect(getSourceFiles(ctx)).toEqual(['module.ts', 'types.mts']);
		expect(getSourceFiles(ctx, ['.mts'])).toEqual(['types.mts']);
	});

	it('WHEN reading a file stem THEN drops the last extension', () => {
		expect(getFileStem('module.test.ts')).toBe('module.test');
		expect(getFileStem('module')).toBeUndefined();
	});
});
