import { createParseContext } from '@art-md/primitives';
import { describe, expect, it } from 'vitest';

import { createDocumentVisitContext } from './createDocumentVisitContext';

describe('createDocumentVisitContext', () => {
	it('WHEN creating a document context', async () => {
		const markdown = '# Hello';
		const parseContext = createParseContext({ uri: 'file:///a.md' });

		const result = createDocumentVisitContext(markdown, parseContext);

		expect(result.construct.construct).toBe('Document');
		expect(result.source.markdown).toBe('# Hello');
		expect(result.source.tree.type).toBe('root');
		expect(result.parseContext).toBe(parseContext);
	});
});
