import type { EntityDataBase, EntityDataBasePartial } from '@purrception/primitives';

export type PurrfilesEntityPartial<T extends string = string> = EntityDataBasePartial<T> & {
	module: string | undefined;
	path: string;
};

export type PurrfilesEntityData = EntityDataBase & PurrfilesEntityPartial;
