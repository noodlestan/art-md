import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const PREFIX = 'art-md-bin-test-';

/** @provides a unique temporary directory tracked for cleanup */
export function makeTempDir(tempDirs: string[]): string {
	const dir = mkdtempSync(join(tmpdir(), PREFIX));
	tempDirs.push(dir);

	return dir;
}
