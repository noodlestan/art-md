import path from 'node:path';

import type { DirectoryExtractContext } from '@purrception/source-fs';

import { getFileStem, getSourceFiles } from './sourceFiles.js';

/**
 * Finds the file named after the module directory, used as docs source when
 * the module has no `index` file.
 */
export function findModuleEntryFile(
	ctx: DirectoryExtractContext,
	extensions?: string[],
): string | undefined {
	const dirName = path.basename(ctx.dirMeta.path);

	return getSourceFiles(ctx, extensions).find(file => getFileStem(file) === dirName);
}
