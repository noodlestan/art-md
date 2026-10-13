import { describe, expect, it } from 'vitest';

import { isValidVerbosity } from './isValidVerbosity.js';

describe('isValidVerbosity', () => {
	it('GIVEN a supported verbosity, accepts it as a LogVerbosity', () => {
		expect(isValidVerbosity('quiet')).toBe(true);
		expect(isValidVerbosity('default')).toBe(true);
		expect(isValidVerbosity('verbose')).toBe(true);
	});

	it('GIVEN an unsupported verbosity, rejects it', () => {
		expect(isValidVerbosity('loud')).toBe(false);
		expect(isValidVerbosity('')).toBe(false);
	});

	it('GIVEN no verbosity, rejects it', () => {
		expect(isValidVerbosity(undefined)).toBe(false);
	});
});
