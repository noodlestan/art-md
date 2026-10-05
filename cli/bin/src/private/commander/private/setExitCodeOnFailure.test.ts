import process from 'node:process';

import { afterEach, describe, expect, it } from 'vitest';

import { setExitCodeOnFailure } from './setExitCodeOnFailure';

const FAILURE_EXIT_CODE = 1;
const UNSET_EXIT_CODE = 0;

afterEach(() => {
	process.exitCode = UNSET_EXIT_CODE;
});

describe('setExitCodeOnFailure', () => {
	it('GIVEN a null outcome, sets the failure exit code', () => {
		setExitCodeOnFailure(null);

		expect(process.exitCode).toBe(FAILURE_EXIT_CODE);
	});

	it('GIVEN a resolved outcome, leaves the exit code untouched', () => {
		setExitCodeOnFailure({ construct: 'Document' });

		expect(process.exitCode).toBe(UNSET_EXIT_CODE);
	});
});
