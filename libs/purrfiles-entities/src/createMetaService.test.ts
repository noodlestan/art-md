import { describe, expect, it, vi } from 'vitest';

import type { ModuleEntityData, PurrfilesEntityData } from './entities/index.js';

import { createMetaService } from './index.js';

function makeModuleEntityFixture(overrides: Partial<ModuleEntityData> = {}): ModuleEntityData {
	const entity = {
		type: 'module',
		name: 'parse',
		package: '@art-md/parser',
		module: undefined,
		path: 'src/parse',
		functions: ['parse'],
		symbols: { imported: {}, declared: {} },
		...overrides,
	} as ModuleEntityData;

	return entity;
}

const parseEntity = makeModuleEntityFixture();
const parseHelperEntity = makeModuleEntityFixture({
	name: 'parseHelper',
	module: 'parse',
	path: 'src/parse/helpers',
});
const indexEntity = makeModuleEntityFixture({
	name: 'index',
	path: 'src',
});
const serializeEntity = makeModuleEntityFixture({
	name: 'serialize',
	package: '@art-md/serializer',
	path: 'src/serialize',
});
const entities = [parseEntity, parseHelperEntity, indexEntity, serializeEntity];

describe('createMetaService', () => {
	it('FOR getEntities returns a copy of the entities', () => {
		const service = createMetaService(entities);

		const result = service.getEntities();

		expect(result).toEqual(entities);
		expect(result).not.toBe(entities);
	});

	it('FOR getPackageNames returns unique package names', () => {
		const service = createMetaService(entities);

		const result = service.getPackageNames();

		expect(result).toEqual(['@art-md/parser', '@art-md/serializer']);
	});

	it('FOR hasPackage checks whether a package is indexed', () => {
		const service = createMetaService(entities);

		expect(service.hasPackage('@art-md/parser')).toBe(true);
		expect(service.hasPackage('@art-md/unknown')).toBe(false);
	});

	it('FOR getPackageModuleNames returns module names for a package', () => {
		const service = createMetaService(entities);

		const result = service.getPackageModuleNames('@art-md/parser');

		expect(result).toEqual(['parse', 'parseHelper', 'index']);
	});

	it('FOR packageHasModule checks whether a module belongs to a package', () => {
		const service = createMetaService(entities);

		expect(service.packageHasModule('@art-md/parser', 'parse')).toBe(true);
		expect(service.packageHasModule('@art-md/parser', 'unknown')).toBe(false);
	});

	it('FOR getModuleMaybe returns the module or undefined', () => {
		const service = createMetaService(entities);

		expect(service.getModuleMaybe('@art-md/parser', 'parse')).toBe(parseEntity);
		expect(service.getModuleMaybe('@art-md/parser', 'unknown')).toBeUndefined();
	});

	it('FOR getModuleEntities returns entities belonging to a module', () => {
		const service = createMetaService(entities);

		const result = service.getModuleEntities('@art-md/parser', 'parse');

		expect(result).toEqual([parseHelperEntity]);
	});

	it('FOR getEntityMaybe returns the entity or undefined', () => {
		const service = createMetaService(entities);

		expect(service.getEntityMaybe('@art-md/parser', 'module', 'parse')).toBe(parseEntity);
		expect(service.getEntityMaybe('@art-md/parser', 'module', 'unknown')).toBeUndefined();
	});

	it('FOR getEntity returns the entity or throws when unknown', () => {
		const service = createMetaService(entities);

		expect(service.getEntity('@art-md/parser', 'module', 'parse')).toBe(parseEntity);
		expect(() => service.getEntity('@art-md/parser', 'module', 'unknown')).toThrow(
			'Unknown entity @art-md/parser/unknown of type module.',
		);
	});

	it('FOR resolveEntityExpression matches package, type, and name', () => {
		const service = createMetaService(entities);

		expect(service.resolveEntityExpression('@art-md/parser:module:parse')).toBe(parseEntity);
	});

	it('FOR resolveEntityExpression matches type and name', () => {
		const service = createMetaService(entities);

		expect(service.resolveEntityExpression('module:parse')).toBe(parseEntity);
	});

	it('FOR resolveEntityExpression matches package and name', () => {
		const service = createMetaService(entities);

		expect(service.resolveEntityExpression('@art-md/parser:parse')).toBe(parseEntity);
	});

	it('FOR resolveEntityExpression matches name only', () => {
		const service = createMetaService(entities);

		expect(service.resolveEntityExpression('serialize')).toBe(serializeEntity);
	});

	it('FOR resolveEntityExpression warns and returns undefined when unknown', () => {
		const service = createMetaService(entities);
		const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

		const result = service.resolveEntityExpression('unknown');

		expect(result).toBeUndefined();
		expect(warnSpy).toHaveBeenCalledWith('Could not resolve link for "unknown"');
		warnSpy.mockRestore();
	});

	it('FOR resolveLink returns text as-is when makeEntityHref is missing', () => {
		const service = createMetaService(entities);

		const result = service.resolveLink('@art-md/parser:module:parse');

		expect(result).toEqual(['@art-md/parser:module:parse', '@art-md/parser:module:parse']);
	});

	it('FOR resolveLink builds an href using makeEntityHref', () => {
		const makeEntityHref = (entity: PurrfilesEntityData) =>
			`/entities/${entity.package}/${entity.name}`;
		const service = createMetaService(entities, { makeEntityHref });

		const result = service.resolveLink('@art-md/parser:module:parse');

		expect(result).toEqual(['parse', '/entities/@art-md/parser/parse']);
	});

	it('FOR resolveLink builds an href for an entity symbol', () => {
		const makeEntityHref = (_entity: PurrfilesEntityData, symbol?: string) => `/symbol/${symbol}`;
		const service = createMetaService(entities, { makeEntityHref });

		const result = service.resolveLink('@art-md/parser:module:parse#parseConfig');

		expect(result).toEqual(['parseConfig', '/symbol/parseConfig']);
	});

	it('FOR resolveLink returns undefined when the entity cannot be resolved', () => {
		const makeEntityHref = () => '/entities';
		const service = createMetaService(entities, { makeEntityHref });

		const result = service.resolveLink('unknown');

		expect(result).toBeUndefined();
	});

	it('FOR createMetaService throws when entities are duplicated', () => {
		const duplicate = makeModuleEntityFixture();
		const duplicated = [...entities, duplicate];

		expect(() => createMetaService(duplicated)).toThrow('Duplicate entity parse of type module.');
	});

	it('FOR createMetaService throws when entity data is invalid', () => {
		const invalid = { type: 'module' } as unknown as PurrfilesEntityData;

		expect(() => createMetaService([invalid])).toThrow('Invalid entity data');
	});
});
