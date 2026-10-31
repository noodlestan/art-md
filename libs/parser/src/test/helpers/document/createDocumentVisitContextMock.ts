import { makeDocumentMock } from '@art-md/primitives/test-helpers/index.js';
import { vi } from 'vitest';

import type { DocumentVisitContext } from '../../../private/index.js';

/**
 * Builds a {@link DocumentVisitContext} for exercising `buildDocument` in
 * isolation.
 *
 * Returns a mostly-unopinionated context: an empty mocked document, a stubbed
 * mdast root, and vitest spies on every mutation hook, so a test can assert how
 * often constructs were captured without spinning up a real parse.
 *
 * The spies call back into the same context, so `onBeforeConstruct` and
 * `childContext` chain rather than returning `undefined`.
 *
 * @param options - Overrides for the source markdown and mdast tree.
 * @param options.markdown - Source text recorded on `context.source`. Defaults
 *   to `'Hello world'`.
 * @param options.tree - mdast root recorded on `context.source`. Defaults to an
 *   empty root.
 * @returns {DocumentVisitContext} A context with spies in place of its
 *   mutation hooks.
 */
export const createDocumentVisitContextMock = (options?: {
	markdown?: string;
	tree?: unknown;
}): DocumentVisitContext => {
	const markdown = options?.markdown ?? 'Hello world';
	const tree = (options?.tree ?? { type: 'root', children: [] }) as never;
	const construct = makeDocumentMock();
	const context = {
		construct,
		source: { tree, markdown },
		captureChildConstruct: vi.fn(),
		onBeforeConstruct: vi.fn(() => context),
		childContext: vi.fn(() => context),
		parent: vi.fn(() => undefined),
	};
	return context as unknown as DocumentVisitContext;
};
