import { describe, expect, it } from 'vitest';

import type { PurrfilesEntityData } from '../types.js';

import { getEntityTypes } from './getEntityTypes.js';

const declared = {
	ParserConfig: {
		at: 'src/config/types.ts',
		lang: '@purrception/lang-ts',
		name: 'ParserConfig',
		private: false,
		kind: 'type',
		node: {},
	},
	parse: {
		at: 'src/parse/parse.ts',
		lang: '@purrception/lang-ts',
		name: 'parse',
		private: false,
		kind: 'function',
		node: {},
	},
} as unknown as PurrfilesEntityData['symbols']['declared'];

function makeEntityFixture(): PurrfilesEntityData {
	const entity = {
		type: 'module',
		name: 'parse',
		package: '@art-md/parser',
		module: undefined,
		path: 'src/parse',
		symbols: {
			imported: {},
			declared,
		},
	};

	return entity as PurrfilesEntityData;
}

describe('getEntityTypes', () => {
	it('FOR an entity it returns only type declarations', () => {
		const entity = makeEntityFixture();
		const { ParserConfig } = declared;

		const result = getEntityTypes(entity);

		expect(result).toEqual([ParserConfig]);
	});

	it('FOR an entity and an array filter it returns matching types', () => {
		const entity = makeEntityFixture();
		const { ParserConfig } = declared;

		const result = getEntityTypes(entity, ['ParserConfig', 'parse']);

		expect(result).toEqual([ParserConfig]);
	});

	it('FOR an entity and a predicate filter it returns matching types', () => {
		const entity = makeEntityFixture();
		const { ParserConfig } = declared;

		const result = getEntityTypes(entity, item => item.name === 'ParserConfig');

		expect(result).toEqual([ParserConfig]);
	});
});
