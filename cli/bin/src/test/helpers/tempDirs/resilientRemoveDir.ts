import { rm } from 'node:fs/promises';

import { delay } from './delay.js';

/** @provides a recursive directory removal that retries while the directory is busy */
export async function resilientRemoveDir(dir: string): Promise<void> {
	for (const timeout of [1, 25, 250]) {
		try {
			await rm(dir, { recursive: true, force: true });
			return;
		} catch (error) {
			if ((error as NodeJS.ErrnoException).code !== 'ENOTEMPTY') {
				throw error;
			}
			await delay(timeout);
		}
	}
}
