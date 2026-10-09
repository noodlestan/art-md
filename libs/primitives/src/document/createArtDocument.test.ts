import { nodePositionMock } from '@art-md/primitives/src/test/helpers/index.js';
import { describe, expect, it, vi } from 'vitest';

import { createArtDocument } from './createArtDocument.js';

vi.mock('@art-md/primitives', () => {
	return nodePositionMock();
});

describe('createArtDocument', () => {
	it('WHEN creating an ArtDocument from a root node', async () => {
		const result = createArtDocument();

		expect(result.construct).toBe('Document');
		expect(result.children).toEqual([]);
	});
});
