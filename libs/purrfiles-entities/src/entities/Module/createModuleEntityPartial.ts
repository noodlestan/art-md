import type { EntityDataBasePartial } from '@purrception/primitives';

import type { ModuleEntityPartial } from './types.js';

export function createModuleEntityPartial(
	partial: EntityDataBasePartial<'module'>,
	path: string,
	module?: string,
): ModuleEntityPartial {
	return {
		...partial,
		module,
		path,
	};
}
