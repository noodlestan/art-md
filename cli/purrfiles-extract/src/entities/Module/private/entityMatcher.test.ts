import type { DirectoryExtractContext } from '@purrception/source-fs';
import { describe, expect, it } from 'vitest';

import { createEntityMatcher } from './entityMatcher.js';

function makeContext(relative: string, path: string): DirectoryExtractContext {
	return {
		dirMeta: { path, relative, files: [], dirs: [] },
		fsContext: { meta: { package: '@art-md/parser' } },
	} as unknown as DirectoryExtractContext;
}

describe('createEntityMatcher', () => {
	it('WHEN the directory is a top-level module THEN yields a module entity without parent module', async () => {
		const partial = await createEntityMatcher()(makeContext('parse', 'src/parse'));

		expect(partial).toEqual({
			type: 'module',
			name: 'parse',
			package: '@art-md/parser',
			module: undefined,
			path: 'src/parse',
		});
	});

	it('WHEN the directory is nested THEN sets the parent module name', async () => {
		const partial = await createEntityMatcher()(makeContext('test/helpers', 'src/test/helpers'));

		expect(partial).toEqual({
			type: 'module',
			name: 'helpers',
			package: '@art-md/parser',
			module: 'test',
			path: 'src/test/helpers',
		});
	});

	it('WHEN the directory is the root dir THEN yields no entity', async () => {
		const partial = await createEntityMatcher()(makeContext('', 'src/'));

		expect(partial).toBeUndefined();
	});

	it('WHEN a directory name is ignored THEN yields no entity for it nor for its subdirectories', async () => {
		const matcher = createEntityMatcher({ ignore: ['private', 'test/helpers'] });

		expect(await matcher(makeContext('private', 'src/private'))).toBeUndefined();
		expect(await matcher(makeContext('private/helpers', 'src/private/helpers'))).toBeUndefined();
		expect(await matcher(makeContext('test/helpers', 'src/test/helpers'))).toBeUndefined();
		expect(await matcher(makeContext('parse', 'src/parse'))).toBeDefined();
	});
});
