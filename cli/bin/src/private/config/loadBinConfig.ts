import type { LogVerbosity } from '../logger/types';

import type { BinConfig, PartialBinConfig } from './types';

const DEFAULT_OUTPUT_MODE: LogVerbosity = 'quiet';

export function loadBinConfig(overrides: PartialBinConfig = {}): BinConfig {
	return {
		version: __BUILD_VERSION__,
		output: {
			mode: overrides.output?.mode ?? DEFAULT_OUTPUT_MODE,
		},
		codec: overrides.codec ?? {},
	};
}
