import path from 'node:path';

import {
	type ModuleEntityPartial,
	createModuleEntityPartial,
} from '@noodlestan/purrfiles-entities';
import { createEntityPartial } from '@purrception/primitives';
import type { EntityMetaMatcher } from '@purrception/source-fs';

export type EntityMatcherOptions = {
	/**
	 * Directory names or root-relative paths to skip, together with their
	 * subdirectories.
	 */
	ignore?: string[];
};

function isIgnored(relative: string, ignore: string[]): boolean {
	const segments = relative.split('/');
	const candidates = new Set<string>();

	segments.forEach((segment, index) => {
		candidates.add(segment);
		candidates.add(segments.slice(0, index + 1).join('/'));
	});

	return ignore.some(entry => candidates.has(entry));
}

export function createEntityMatcher(
	options: EntityMatcherOptions = {},
): EntityMetaMatcher<ModuleEntityPartial> {
	const ignore = options.ignore ?? [];

	return async ctx => {
		const relative = ctx.dirMeta.relative;
		if (!relative || isIgnored(relative, ignore)) {
			return;
		}

		const name = path.basename(relative);
		const parent = path.dirname(relative);
		const module = parent === '.' ? undefined : path.basename(parent);
		// eslint-disable-next-line dot-notation
		const packageName = ctx.fsContext.meta['package'] as string;
		const partial = createEntityPartial('module', name, packageName);

		return createModuleEntityPartial(partial, ctx.dirMeta.path, module);
	};
}
