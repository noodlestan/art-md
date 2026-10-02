import { writeFile } from 'node:fs/promises';

import { writeStdout } from './private/writeStdout';

const ENCODING = 'utf8';

export async function writeOutput(content: string, target?: string): Promise<void> {
	if (target === undefined) {
		await writeStdout(content);
		return;
	}
	await writeFile(target, content, ENCODING);
}
