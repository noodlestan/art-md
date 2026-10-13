import type { BinConfig, PartialBinConfig } from '../../../private/config/types.js';

const DEFAULT_CONFIG: BinConfig = {
	version: '0.0.0-test',
	output: { mode: 'quiet' },
	codec: {},
};

/** @provides a BinConfig fixture with test defaults */
export function makeConfigFixture(overrides: PartialBinConfig = {}): BinConfig {
	return {
		...DEFAULT_CONFIG,
		...overrides,
		output: { ...DEFAULT_CONFIG.output, ...overrides.output },
		codec: { ...DEFAULT_CONFIG.codec, ...overrides.codec },
	};
}
