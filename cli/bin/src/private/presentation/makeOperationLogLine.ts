import type { OperationBase } from '../operations/types';

import { OUTCOME_GLYPHS } from './constants';

export function makeOperationLogLine(
	op: OperationBase,
	options: { standalone?: boolean } = {},
): string[] {
	const standalone = options.standalone === true;

	const milliseconds = op.timing();
	const timing = standalone ? `(${milliseconds}ms)` : String(milliseconds);
	const hasFinished = op.finishedTs !== undefined;

	return [OUTCOME_GLYPHS[op.outcome], op.operation, op.message(), hasFinished ? timing : ''];
}
