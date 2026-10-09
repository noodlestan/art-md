import type { ArtCodec } from '@art-md/primitives';

import type { BinConfig } from '../config/types.js';
import type { CommandIo } from '../io/types.js';
import type { OperationsLog } from '../operations/types.js';

export type CommandContext = {
	config: BinConfig;
	codec: ArtCodec;
	operations: OperationsLog;
	io: CommandIo;
};
