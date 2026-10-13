import type { ArtDocument, SerializeResult } from '@art-md/primitives';

import type { CommandContext } from '../../../context/types.js';
import type { OperationRun } from '../../types.js';

export function executeSerialize(
	ctx: CommandContext,
	source: string,
): OperationRun<SerializeResult> {
	const document = JSON.parse(source) as ArtDocument;
	const result = ctx.codec.serialize(document);

	return {
		result,
		output: result.content,
	};
}
