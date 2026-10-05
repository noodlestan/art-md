import { writeFile } from 'node:fs/promises';

import { writeStdout } from './private/writeStdout';

const ENCODING = 'utf8';
const LINE_ENDING = '\n';

function terminate(content: string): string {
	return content.endsWith(LINE_ENDING) ? content : `${content}${LINE_ENDING}`;
}

export async function writeOutput(content: string, target?: string): Promise<void> {
	const terminated = terminate(content);

	if (target === undefined) {
		await writeStdout(terminated);
		return;
	}
	await writeFile(target, terminated, ENCODING);
}
