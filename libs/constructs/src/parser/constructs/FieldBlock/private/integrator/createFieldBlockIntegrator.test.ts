import { makeParserVisitContextMock } from '@art-md/primitives/src/test/helpers';
import { describe, expect, it, vi } from 'vitest';

import { makeFieldBlockFixture } from '../../../../../test/helpers/index.js';
import { onBeforeConstruct } from '../helpers/onBeforeConstruct.js';

import { createFieldBlockIntegrator } from './createFieldBlockIntegrator.js';

describe('createFieldBlockIntegrator', () => {
	it('WHEN integrating captures the construct and returns a child context', () => {
		const integrator = createFieldBlockIntegrator();
		const context = makeParserVisitContextMock();
		const nextContext = makeParserVisitContextMock();
		vi.mocked(context.childContext).mockReturnValue(nextContext);
		const field = makeFieldBlockFixture();

		const result = integrator.integrate(context, {} as never, field as never);

		expect(context.captureChildConstruct).toHaveBeenCalledWith(field);
		expect(context.childContext).toHaveBeenCalledWith(field, onBeforeConstruct);
		expect(result).toBe(nextContext);
	});
});
