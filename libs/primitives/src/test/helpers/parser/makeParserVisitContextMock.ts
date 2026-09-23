import { vi } from 'vitest';

import { createParseContext } from '../../../parser/context';
import type { ParserVisitContext } from '../../../parser/context/types';
import { makeDocumentMock } from '../document/makeDocumentMock';

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
