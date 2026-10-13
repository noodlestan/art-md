import type { ParseResult } from '@art-md/primitives';

import type { CommandContext } from '../../../context/types.js';
import { presentDocument } from '../../../presentation/presentDocument.js';
import type { OperationRun } from '../../types.js';

export function executeParse(ctx: CommandContext, source: string): OperationRun<ParseResult> {
	const result = ctx.codec.parse(source);
	const presented = presentDocument(result.document);

	return {
		result,
		output: presented,
	};
}
