import { writeFile } from 'node:fs/promises';

import { writeStdout } from './writeStdout.js';

const ENCODING = 'utf8';
const LINE_ENDING = '\n';

export async function writeOutput(content: string, target?: string): Promise<void> {
	const endsWithLineEnding = content.endsWith(LINE_ENDING);
	const terminated = endsWithLineEnding ? content : `${content}${LINE_ENDING}`;

	if (target === undefined) {
		await writeStdout(terminated);
		return;
	}
	await writeFile(target, terminated, ENCODING);
}
