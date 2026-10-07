import type { PartialArtCodecConfig } from '@art-md/codec';

import type { LogVerbosity } from '../logger/types';

export type BinConfig = {
	version: string;
	output: {
		mode: LogVerbosity;
	};
	codec: PartialArtCodecConfig;
};

export type PartialBinConfig = {
	output?: BinConfig['output'];
	codec?: BinConfig['codec'];
};
