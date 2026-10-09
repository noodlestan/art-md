import { makeParserVisitContextMock } from '@art-md/primitives/src/test/helpers/index.js';
import { describe, expect, it, vi } from 'vitest';

import { createNaturalBlockFromNodeMock } from '../../../../../test/helpers/index.js';
import { createNaturalBlockFromNode } from '../helpers/createNaturalBlockFromNode.js';

import { createNaturalBlockProcessor } from './createNaturalBlockProcessor.js';

vi.mock('../helpers/createNaturalBlockFromNode', async () => {
	return createNaturalBlockFromNodeMock();
});

describe('createNaturalBlockProcessor', () => {
	it('WHEN capturing a node returns the createNaturalBlockFromNode result', () => {
		const processor = createNaturalBlockProcessor();
		const context = makeParserVisitContextMock();
		const node = { type: 'paragraph', children: [] };

		const result = processor.captureNode(context, node);

		expect(createNaturalBlockFromNode).toHaveBeenCalledWith(node, context);
		expect(result).toBe(vi.mocked(createNaturalBlockFromNode).mock.results[0]?.value);
	});
});
