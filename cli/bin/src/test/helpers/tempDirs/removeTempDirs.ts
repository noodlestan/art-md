import { resilientRemoveDir } from './resilientRemoveDir.js';

/** @provides the removal of every temporary directory collected by `makeTempDir` */
export async function removeTempDirs(tempDirs: string[]): Promise<void> {
	const removals = tempDirs.splice(0).map(resilientRemoveDir);

	await Promise.all(removals);
}
