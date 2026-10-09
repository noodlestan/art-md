import { describe, expect, it } from 'vitest';

import { makeNaturalExpressionFixture } from '../../../../test/helpers/index.js';

import { createNaturalExpression } from './createNaturalExpression.js';

describe('createNaturalExpression', () => {
	it('WHEN creating a NaturalExpression from data', () => {
		const result = createNaturalExpression({ type: 'text', value: 'hello' });
		expect(result).toEqual(makeNaturalExpressionFixture());
	});

	it('WHEN provided includes children and attributes', () => {
		const result = createNaturalExpression({
			type: 'strong',
			attributes: { bold: true },
			children: [makeNaturalExpressionFixture({ value: 'hi' })],
		});
		expect(result.attributes).toEqual({ bold: true });
		expect(result.children).toHaveLength(1);
	});
});
