import type { PurrfilesEntityData, PurrfilesEntityPartial } from '../types.js';

export type ModuleEntityFiles = {
	index?: string;
	types?: string;
	functions: string[];
};

export type ModuleEntityPartial = PurrfilesEntityPartial & {
	type: 'module';
};

export type ModuleEntityData = ModuleEntityPartial &
	PurrfilesEntityData & {
		functions: string[];
	};
