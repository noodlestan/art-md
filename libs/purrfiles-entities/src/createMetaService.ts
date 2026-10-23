import type { ModuleEntityData, PurrfilesEntityData } from './entities/index.js';
import { indexEntities, resolveEntityExpressionParts } from './private/index.js';
import type { ResolvedExpression } from './private/index.js';
import type { PurrfilesMetaAPI, PurrfilesMetaOptions } from './types.js';

export function createMetaService(
	entities: PurrfilesEntityData[],
	options: PurrfilesMetaOptions = {},
): PurrfilesMetaAPI {
	const { makeEntityHref } = options;
	const index = indexEntities(entities);

	const getEntities = (): PurrfilesEntityData[] => {
		return [...entities];
	};

	const getEntityMaybe = <T extends PurrfilesEntityData>(
		pkg: string,
		type: string,
		name: string,
	): T | undefined => {
		return index[pkg]?.[type]?.[name] as T | undefined;
	};

	const getEntity = <T extends PurrfilesEntityData>(pkg: string, type: string, name: string): T => {
		const entity = getEntityMaybe(pkg, type, name);
		if (!entity) {
			throw new Error(`Unknown entity ${pkg}/${name} of type ${type}.`);
		}
		return entity as T;
	};

	const getPackageNames = () => {
		return Object.keys(index);
	};

	const hasPackage = (pkg: string) => {
		return getPackageNames().includes(pkg);
	};

	const getPackageModuleNames = (pkg: string) => {
		const all = entities
			.filter(ent => ent.package === pkg && ent.type === 'module')
			.map(ent => ent.name)
			.filter(Boolean) as string[];

		return [...new Set(all)];
	};

	const packageHasModule = (pkg: string, mod: string) => {
		return getPackageModuleNames(pkg).includes(mod);
	};

	const getModuleMaybe = (pkg: string, mod: string) => {
		// eslint-disable-next-line dot-notation
		return index[pkg]?.['module']?.[mod] as ModuleEntityData | undefined;
	};

	const getModuleEntities = (pkg: string, mod: string) => {
		// eslint-disable-next-line dot-notation
		const byType = Object.values(index[pkg] || {});

		return byType.map(byName => Object.values(byName).filter(ent => ent.module === mod)).flat();
	};

	const matchExpression = (resolved: ResolvedExpression): PurrfilesEntityData | undefined => {
		const { pkg, type, name } = resolved;

		if (pkg && type) {
			return index[pkg]?.[type]?.[name] as PurrfilesEntityData | undefined;
		}
		if (type) {
			return entities.find(e => e.type === type && e.name === name);
		}
		if (pkg) {
			return entities.find(e => e.package === pkg && e.name === name);
		}
		return entities.find(e => e.name === name);
	};

	const resolveEntityExpression = (expression: string): PurrfilesEntityData | undefined => {
		const resolved = resolveEntityExpressionParts(expression);
		const entity = matchExpression(resolved);

		if (!entity) {
			console.warn(`Could not resolve link for "${expression}"`);
			return undefined;
		}

		return entity;
	};

	const resolveLink = (text: string): [displayName: string, href: string] | undefined => {
		if (!makeEntityHref) {
			return [text, text];
		}
		const [entityNameExpression, symbol] = text.split('#');
		const entity = resolveEntityExpression(entityNameExpression as string);
		if (!entity) {
			return undefined;
		}
		const href = makeEntityHref(entity, symbol || undefined);
		return [symbol ?? entity.name, href];
	};

	return {
		getEntities,
		getEntityMaybe,
		getEntity,
		getPackageNames,
		hasPackage,
		getPackageModuleNames,
		packageHasModule,
		getModuleMaybe,
		getModuleEntities,
		resolveEntityExpression,
		resolveLink,
	};
}
