import { vi } from 'vitest';

import { createParseContext } from '../../../parser/context/index.js';
import type { ParserVisitContext } from '../../../parser/context/types.js';
import { makeDocumentMock } from '../document/makeDocumentMock.js';

export const makeParserVisitContextMock = (options?: {
	markdown?: string;
}): ParserVisitContext => ({
	construct: makeDocumentMock(),
	parseContext: createParseContext({ uri: '' }),
	source: {
		tree: { type: 'root', children: [] } as never,
		markdown: options?.markdown ?? '',
	},
	captureChildConstruct: vi.fn(),
	onBeforeConstruct: vi.fn(),
	childContext: vi.fn(),
	parent: vi.fn(() => undefined),
});
