import process from 'node:process';

import { vi } from 'vitest';

/** @provides a `process.stdout.write` spy that records the chunks it writes */
export function spyOnStdoutWrite(chunks?: string[]): ReturnType<typeof vi.spyOn> {
	const writeSpy = vi.spyOn(process.stdout, 'write').mockImplementation(((
		chunk: string,
		callback?: () => void,
	): boolean => {
		chunks?.push(chunk);
		if (callback) {
			callback();
		}
		return true;
	}) as unknown as typeof process.stdout.write);

	return writeSpy;
}
