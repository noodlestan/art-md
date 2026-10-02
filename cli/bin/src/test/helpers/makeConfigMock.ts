import { loadBinConfig } from '../../private/config/loadBinConfig';
import type { BinConfig, PartialBinConfig } from '../../private/config/types';

export function makeConfigMock(overrides: PartialBinConfig = {}): BinConfig {
	const defaults = loadBinConfig();
	return { ...defaults, ...overrides };
}
