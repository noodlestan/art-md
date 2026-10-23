import type { PurrfilesEntityData } from '../entities/index.js';

type IndexByName = Record<string, PurrfilesEntityData>;
type IndexByType = Record<string, IndexByName>;
type IndexByPackage = Record<string, IndexByType>;

export function indexEntities(data: PurrfilesEntityData[]): IndexByPackage {
	const index: IndexByPackage = {};

	for (const entity of data) {
		const { package: pkg, name, type } = entity;
		if (typeof pkg !== 'string' || typeof type !== 'string' || typeof name !== 'string') {
			console.error(`Invalid entity`, entity);
			throw new Error('Invalid entity data');
		}
		if (!(pkg in index)) {
			index[pkg] = {};
		}
		const byType = index[pkg] as IndexByType;
		if (!(type in byType)) {
			byType[type] = {};
		}
		const byName = byType[type] as IndexByName;
		if (name in byName) {
			console.error('Existing entry:', byName[name]);
			console.error('Duplicate entry:', entity);
			throw new Error(`Duplicate entity ${name} of type ${type}.`);
		}
		byName[name] = entity;
	}
	return index;
}
