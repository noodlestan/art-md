import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import { readPackageVersion } from './readPackageVersion';

describe('readPackageVersion', () => {
	it('WHEN called returns the bin package version', () => {
		const version = readPackageVersion();

		expect(version).toMatch(/^\d+\.\d+\.\d+/);
	});

	it('GIVEN a directory outside the package, throws', () => {
		const outside = mkdtempSync(join(tmpdir(), 'art-md-bin-outside-'));

		expect(() => readPackageVersion(outside)).toThrow(/Cannot find/);
	});
});
