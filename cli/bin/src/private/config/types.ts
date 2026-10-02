import type { PartialArtCodecConfig } from '@art-md/codec';

export type OutputMode = 'quiet' | 'verbose';

export type BinConfig = {
	version: string;
	output: { mode: OutputMode };
	codec: PartialArtCodecConfig;
};

export type PartialBinConfig = {
	output?: BinConfig['output'];
	codec?: BinConfig['codec'];
};
