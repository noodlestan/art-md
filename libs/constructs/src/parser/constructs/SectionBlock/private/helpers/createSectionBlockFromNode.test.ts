import { makeParserVisitContextMock } from '@art-md/primitives/src/test/helpers/index.js';
import type { Heading } from 'mdast';
import { fromMarkdown } from 'mdast-util-from-markdown';
import { describe, expect, it, vi } from 'vitest';

import { createSectionBlock } from '../../../../../factories/index.js';

import { createSectionBlockFromNode } from './createSectionBlockFromNode.js';

vi.mock('../../../../../factories/constructs/SectionBlock/factory/createSectionBlock', async () => {
	const { createSectionBlockMock } = await import('../../../../../test/helpers/index.js');
	return createSectionBlockMock();
});

describe('createSectionBlockFromNode', () => {
	it('WHEN creating a SectionBlock from a heading', () => {
		const markdown = '# Hello World';
		const tree = fromMarkdown(markdown);
		const heading = tree.children[0] as Heading;
		const context = makeParserVisitContextMock({ markdown });

		const result = createSectionBlockFromNode(heading, context);

		expect(createSectionBlock).toHaveBeenCalledWith(
			expect.objectContaining({ name: 'Hello World', depth: 1, children: [], tags: [] }),
		);
		expect(result).toBe(vi.mocked(createSectionBlock).mock.results[0]?.value);
	});

	it('WHEN the heading contains a colon keeps the whole text as name', () => {
		const markdown = '# Module: Hello';
		const tree = fromMarkdown(markdown);
		const heading = tree.children[0] as Heading;
		const context = makeParserVisitContextMock({ markdown });

		createSectionBlockFromNode(heading, context);

		expect(createSectionBlock).toHaveBeenCalledWith(
			expect.objectContaining({ name: 'Module: Hello', depth: 1 }),
		);
	});

	it('WHEN the heading has trailing tags passes them and strips the name', () => {
		const markdown = '# Hello (#tag)';
		const tree = fromMarkdown(markdown);
		const heading = tree.children[0] as Heading;
		const context = makeParserVisitContextMock({ markdown });

		createSectionBlockFromNode(heading, context);

		expect(createSectionBlock).toHaveBeenCalledWith(
			expect.objectContaining({
				name: 'Hello',
				tags: [{ construct: 'Tag', name: 'tag' }],
			}),
		);
	});
});
