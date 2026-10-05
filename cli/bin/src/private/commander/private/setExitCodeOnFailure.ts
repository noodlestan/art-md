import process from 'node:process';

const FAILURE_EXIT_CODE = 1;

export function setExitCodeOnFailure(outcome: unknown): void {
	if (outcome === null) {
		process.exitCode = FAILURE_EXIT_CODE;
	}
}
