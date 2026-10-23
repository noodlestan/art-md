import type { DirectoryExtractContext } from '@purrception/source-fs';

import { getFileStem, getSourceFiles } from './sourceFiles.js';

const NON_SYMBOL_STEMS = ['index', 'types'];

/**
 * Lists the module files that may declare functions or other symbols.
 *
 * `index` and `types` files have their own roles, so they are excluded; any
 * other source file is a symbol source, including `constants.ts`.
 */
export function findModuleSourceFiles(
	ctx: DirectoryExtractContext,
	extensions?: string[],
): string[] {
	return getSourceFiles(ctx, extensions).filter(
		// Every source file has a stem.
		file => !NON_SYMBOL_STEMS.includes(getFileStem(file) as string),
	);
}
