import type { ModuleEntityData } from '@noodlestan/purrfiles-entities';
import { extractEntitiesFromFileSystem } from '@purrception/source-fs';
import { describe, expect, it } from 'vitest';

import type { ModuleEntityExtractorOptions } from './createModuleEntityExtractor.js';
import { createModuleEntityExtractor } from './createModuleEntityExtractor.js';

async function extractParserModules(
	options?: ModuleEntityExtractorOptions,
): Promise<ModuleEntityData[]> {
	const extracted = await extractEntitiesFromFileSystem({
		rootDir: '../../libs/parser/src/',
		extractors: [createModuleEntityExtractor(options)],
		meta: { package: '@art-md/parser' },
	});

	return extracted.map(({ entity }) => entity as ModuleEntityData);
}

describe('createModuleEntityExtractor', () => {
	it('WHEN extracting the parser source THEN yields Module parse with a single documented parse function', async () => {
		const entities = await extractParserModules();
		const parse = entities.find(entity => entity.name === 'parse');

		expect(parse).toBeDefined();
		expect(parse?.type).toBe('module');
		expect(parse?.functions).toEqual(['parse']);
		expect(parse?.symbols.declared).toHaveProperty('parse');
		expect(parse?.description).toBeDefined();
	});

	it('WHEN a module declares its function in a sibling file THEN the function is extracted', async () => {
		const entities = await extractParserModules();
		const buildDocument = entities.find(entity => entity.name === 'buildDocument');

		expect(buildDocument).toBeDefined();
		expect(buildDocument?.functions).toEqual(['buildDocument']);
		expect(buildDocument?.symbols.declared).toHaveProperty('buildDocument');
	});

	it('WHEN a module is nested THEN sets the parent module name', async () => {
		const entities = await extractParserModules();
		const document = entities.find(entity => entity.name === 'document');

		expect(document).toBeDefined();
		expect(document?.module).toBe('helpers');
	});

	it('WHEN a directory holds nothing but subdirectories THEN it is not a module', async () => {
		const entities = await extractParserModules();

		expect(entities.map(entity => entity.name)).not.toContain('test');
	});

	it('WHEN directories are ignored THEN they are not extracted, with their subdirectories', async () => {
		const entities = await extractParserModules({ ignore: ['private', 'test'] });
		const names = entities.map(entity => entity.name);

		expect(names).not.toContain('private');
		expect(names).not.toContain('test');
		expect(names).not.toContain('helpers');
		expect(names).toContain('parse');
	});

	it('WHEN subdirectories are skipped THEN only top-level modules are extracted', async () => {
		const entities = await extractParserModules({ ignore: ['test'], skipSubDirs: true });

		expect(entities.every(entity => entity.module === undefined)).toBe(true);
		expect(entities.map(entity => entity.name)).toContain('parse');
	});
});
