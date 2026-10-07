import type { OperationOutcome } from '../operations/types';

export const JSON_INDENT = 2;

export const OUTCOME_GLYPHS: Record<OperationOutcome, string> = {
	pending: '⏳',
	success: '🟢',
	failure: '🔴',
};
