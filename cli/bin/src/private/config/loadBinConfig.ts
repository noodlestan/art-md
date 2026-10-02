import { readPackageVersion } from './private/readPackageVersion';
import type { BinConfig, OutputMode, PartialBinConfig } from './types';

const DEFAULT_OUTPUT_MODE: OutputMode = 'quiet';

export function loadBinConfig(overrides: PartialBinConfig = {}): BinConfig {
	return {
		version: readPackageVersion(),
		output: {
			mode: overrides.output?.mode ?? DEFAULT_OUTPUT_MODE,
		},
		codec: overrides.codec ?? {},
	};
}
