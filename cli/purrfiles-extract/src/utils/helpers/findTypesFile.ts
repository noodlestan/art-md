import type { DirectoryExtractContext } from '@purrception/source-fs';

import { getFileStem, getSourceFiles } from './sourceFiles.js';

export function findTypesFile(
	ctx: DirectoryExtractContext,
	extensions?: string[],
): string | undefined {
	return getSourceFiles(ctx, extensions).find(file => getFileStem(file) === 'types');
}
