const FAILURE_LABELS: Record<string, string> = {
	parse: 'ParseError',
	serialize: 'SerializeError',
};

const DEFAULT_FAILURE_LABEL = 'OperationError';

export function getFailureLabel(operation: string): string {
	return FAILURE_LABELS[operation] ?? DEFAULT_FAILURE_LABEL;
}
