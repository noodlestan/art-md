import { describe, expect, it } from 'vitest';

import type { PurrfilesEntityData } from '../types.js';

import { getEntityFunctions } from './getEntityFunctions.js';

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

describe('getEntityFunctions', () => {
	it('FOR an entity it returns only function declarations', () => {
		const entity = makeEntityFixture();
		const { parse } = declared;

		const result = getEntityFunctions(entity);

		expect(result).toEqual([parse]);
	});

	it('FOR an entity and an array filter it returns matching functions', () => {
		const entity = makeEntityFixture();
		const { parse } = declared;

		const result = getEntityFunctions(entity, ['ParserConfig', 'parse']);

		expect(result).toEqual([parse]);
	});

	it('FOR an entity and a predicate filter it returns matching functions', () => {
		const entity = makeEntityFixture();
		const { parse } = declared;

		const result = getEntityFunctions(entity, item => item.name === 'parse');

		expect(result).toEqual([parse]);
	});
});
