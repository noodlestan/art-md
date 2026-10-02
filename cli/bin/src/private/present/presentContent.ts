import { JSON_INDENT, type PresentOptions } from './types';

export function presentContent(content: string, options: PresentOptions): string {
	if (options.json === true) {
		const payload = { content };
		return JSON.stringify(payload, null, JSON_INDENT);
	}
	return content;
}
