import type { ModuleEntityFiles, ModuleEntityPartial } from '@noodlestan/purrfiles-entities';
import type { EntityFileResolver } from '@purrception/source-fs';

import {
	findIndexFile,
	findModuleEntryFile,
	findModuleSourceFiles,
	findTypesFile,
} from '../../../utils/index.js';

export type FileResolverOptions = {
	/** Source extensions to read. Defaults to TypeScript source extensions. */
	extensions?: string[];
};

/**
 * Resolves the files of a module directory.
 *
 * No file is required: an entry file or `index` file is only needed for docs.
 * Directories holding nothing but subdirectories are not modules and are
 * skipped.
 */
export function createFileResolver(
	options: FileResolverOptions = {},
): EntityFileResolver<ModuleEntityPartial, ModuleEntityFiles> {
	const { extensions } = options;

	return async ctx => {
		const index = findIndexFile(ctx, extensions) ?? findModuleEntryFile(ctx, extensions);
		const types = findTypesFile(ctx, extensions);
		const functions = findModuleSourceFiles(ctx, extensions);

		if (index === undefined && types === undefined && functions.length === 0) {
			return;
		}

		return {
			index,
			types,
			functions,
		};
	};
}
