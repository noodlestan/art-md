import type { ConstructFactoryEntry, ConstructFactoryFunction } from '@art-md/primitives';

const DISCARDED_CONSTRUCT_FACTORY_NAMES = ['Document'];

export function createFactoryIndex(
	factories: readonly ConstructFactoryEntry[],
): Map<string, ConstructFactoryFunction> {
	const discardedNames = new Set(DISCARDED_CONSTRUCT_FACTORY_NAMES);
	const creatableFactories = factories.filter(entry => !discardedNames.has(entry.name));
	const factoryEntries = creatableFactories.map(entry => [entry.name, entry.factory] as const);
	return new Map(factoryEntries);
}
