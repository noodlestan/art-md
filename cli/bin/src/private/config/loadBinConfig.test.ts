import { describe, expect, it } from 'vitest';

import { loadBinConfig } from './loadBinConfig.js';

describe('loadBinConfig', () => {
	it('WHEN no overrides are given returns the package defaults', () => {
		const config = loadBinConfig();

		expect(config).toEqual({
			version: expect.any(String),
			output: { mode: 'quiet' },
			codec: {},
		});
	});

	it('WHEN called returns the package version', () => {
		const config = loadBinConfig();

		expect(config.version).toMatch(/^\d+\.\d+\.\d+/);
	});

	it('GIVEN an output mode override, returns it instead of the default', () => {
		const config = loadBinConfig({ output: { mode: 'verbose' } });

		expect(config.output.mode).toBe('verbose');
	});

	it('GIVEN codec overrides, passes them through to the config', () => {
		const parserConfig = { constructs: [] };
		const config = loadBinConfig({ codec: { parserConfig } });

		expect(config.codec).toEqual({ parserConfig });
	});

	it('WHEN called repeatedly returns equal configs', () => {
		const first = loadBinConfig();
		const second = loadBinConfig();

		expect(first).toEqual(second);
	});
});
