export function formatRawError(raw: string): string {
	const lines = raw.split('\n');
	const trimmedLines = lines.map(line => line.trim());
	const nonEmptyLines = trimmedLines.filter(line => line.length > 0);

	return nonEmptyLines.map(line => `  ${line}`).join('\n');
}
