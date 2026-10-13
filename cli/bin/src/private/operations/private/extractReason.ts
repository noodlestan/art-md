export function extractReason(raw: string): string {
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
