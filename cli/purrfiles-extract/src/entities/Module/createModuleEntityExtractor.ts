import type {
	ModuleEntityData,
	ModuleEntityFiles,
	ModuleEntityPartial,
} from '@noodlestan/purrfiles-entities';
import {
	type DirectoryExtractAPI,
	type DirectoryExtractorOptions,
	defineDirectoryExtractor,
} from '@purrception/source-fs';

import { createEntityMatcher, createFileResolver, entityExtractor } from './private/index.js';

export type ModuleEntityExtractorOptions = DirectoryExtractorOptions<
	ModuleEntityPartial,
	ModuleEntityFiles,
	ModuleEntityData
> & {
	/** Source extensions to read. Defaults to TypeScript source extensions. */
	extensions?: string[];
	/** Directory names or root-relative paths to skip, with their subdirectories. */
	ignore?: string[];
	/** Whether to descend into subdirectories of a module. Defaults to `false`. */
	skipSubDirs?: boolean;
};

export type ModuleEntityExtractor = (options?: ModuleEntityExtractorOptions) => DirectoryExtractAPI;

export const createModuleEntityExtractor: ModuleEntityExtractor = (options = {}) => {
	return defineDirectoryExtractor({
		match: options.matcher ?? createEntityMatcher({ ignore: options.ignore }),
		resolve: options.resolver ?? createFileResolver({ extensions: options.extensions }),
		extract: entityExtractor,
		skipSubDirs: options.skipSubDirs ?? false,
	});
};
