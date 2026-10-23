import type { ModuleEntityData, PurrfilesEntityData } from './entities/index.js';

export type PurrfilesMetaOptions = {
	makeEntityHref?: (entity: PurrfilesEntityData, symbol?: string) => string;
};

export type PurrfilesMetaAPI = {
	getEntities(): PurrfilesEntityData[];
	getEntityMaybe<T extends PurrfilesEntityData>(
		pkg: string,
		type: string,
		name: string,
	): T | undefined;
	getEntity<T extends PurrfilesEntityData>(pkg: string, type: string, name: string): T;
	getPackageNames(): string[];
	hasPackage(pkg: string): boolean;
	getPackageModuleNames(pkg: string): string[];
	packageHasModule(pkg: string, mod: string): boolean;
	getModuleMaybe(pkg: string, mod: string): ModuleEntityData | undefined;
	getModuleEntities(pkg: string, mod: string): PurrfilesEntityData[];
	resolveEntityExpression(expression: string): PurrfilesEntityData | undefined;
	resolveLink(text: string): [displayName: string, href: string] | undefined;
};
