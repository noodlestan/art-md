import type { OperationFailure, OperationPending } from './types';

const FAILURE_LABELS: Record<string, string> = {
	parse: 'ParseError',
	serialize: 'SerializeError',
};

const DEFAULT_FAILURE_LABEL = 'OperationError';

function formatRawError(raw: string): string {
	const lines = raw
		.split('\n')
		.map(line => line.trim())
		.filter(line => line.length > 0);
	return lines.map(line => `  ${line}`).join('\n');
}

function extractReason(raw: string): string {
	const reason = raw.match(/\(([^)]+)\)/)?.[1];
	if (reason !== undefined) {
		return reason;
	}

	const firstLine = raw.split('\n')[0]?.trim() ?? '';
	if (firstLine.length === 0) {
		return 'unknown error';
	}
	return firstLine;
}

function getFailureLabel(operation: string): string {
	return FAILURE_LABELS[operation] ?? DEFAULT_FAILURE_LABEL;
}

export function createOperationFailure<T extends OperationPending>(
	pending: T,
	error: unknown,
): OperationFailure {
	const rawError = error instanceof Error ? error.message : String(error);
	const label = getFailureLabel(pending.operation);

	return {
		...pending,
		outcome: 'failure',
		finishedTs: new Date(),
		error: rawError,
		message() {
			return extractReason(this.error);
		},
		errorSerialized() {
			return `${label}: ${this.message()}\n\n${formatRawError(this.error)}`;
		},
	};
}
