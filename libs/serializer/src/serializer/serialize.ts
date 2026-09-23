import {
	type ArtDocument,
	type SerializeContext,
	type SerializeResult,
	createSerializeContext,
} from '@art-md/primitives';
import type { Root } from 'mdast';
import { toMarkdown } from 'mdast-util-to-markdown';

import { artAstToMdast } from '../artAstToMdast/artAstToMdast';
import type { SerializerConfig } from '../config/types';

export function serialize(document: ArtDocument, config: SerializerConfig): SerializeResult;
export function serialize(
	context: SerializeContext,
	document: ArtDocument,
	config: SerializerConfig,
): SerializeResult;
export function serialize(
	documentOrContext: ArtDocument | SerializeContext,
	documentOrConfig: ArtDocument | SerializerConfig,
	config?: SerializerConfig,
): SerializeResult {
	const hasContext = 'uri' in documentOrContext;
	const document = hasContext
		? (documentOrConfig as ArtDocument)
		: (documentOrContext as ArtDocument);
	const resolvedConfig = hasContext
		? (config as SerializerConfig)
		: (documentOrConfig as SerializerConfig);
	const context = hasContext
		? (documentOrContext as SerializeContext)
		: createSerializeContext({ uri: '' });

	const root = artAstToMdast(resolvedConfig, document) as Root;
	const content = toMarkdown(root, { bullet: '-', emphasis: '_' });
	return { content, context };
}
