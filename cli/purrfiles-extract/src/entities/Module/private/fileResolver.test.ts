import type { DirectoryExtractContext } from '@purrception/source-fs';
import { describe, expect, it } from 'vitest';

import { createFileResolver } from './fileResolver.js';

const partial = {
	type: 'module',
	name: 'parse',
	package: '@art-md/parser',
	module: undefined,
	path: '/repo/src/parse',
} as const;

function makeContext(files: string[]): DirectoryExtractContext {
	return {
		dirMeta: {
			path: '/repo/src/parse',
			relative: 'parse',
			files,
			dirs: [],
		},
	} as unknown as DirectoryExtractContext;
}

describe('createFileResolver', () => {
	it('WHEN the directory has no index file THEN uses the same-name file as entry', async () => {
		const ctx = makeContext(['parse.ts', 'parse.test.ts', 'types.ts']);

		const files = await createFileResolver()(ctx, { ...partial });

		expect(files).toEqual({
			index: 'parse.ts',
			types: 'types.ts',
			functions: ['parse.ts'],
		});
	});

	it('WHEN the directory has an index file THEN collects sibling sources as functions', async () => {
		const ctx = makeContext(['buildDocument.ts', 'buildDocument.test.ts', 'index.ts']);

		const files = await createFileResolver()(ctx, { ...partial });

		expect(files).toEqual({
			index: 'index.ts',
			types: undefined,
			functions: ['buildDocument.ts'],
		});
	});

	it('WHEN the directory declares constants THEN collects them as function sources', async () => {
		const ctx = makeContext(['constants.ts', 'index.ts', 'types.ts']);

		const files = await createFileResolver()(ctx, { ...partial });

		expect(files).toEqual({
			index: 'index.ts',
			types: 'types.ts',
			functions: ['constants.ts'],
		});
	});

	it('WHEN custom extensions are given THEN only those files are resolved', async () => {
		const ctx = makeContext(['index.mts', 'parse.mts', 'types.ts']);

		const files = await createFileResolver({ extensions: ['.mts'] })(ctx, { ...partial });

		expect(files).toEqual({
			index: 'index.mts',
			types: undefined,
			functions: ['parse.mts'],
		});
	});

	it('WHEN the directory only holds subdirectories THEN yields no module', async () => {
		const ctx = makeContext([]);

		const files = await createFileResolver()(ctx, { ...partial });

		expect(files).toBeUndefined();
	});
});
