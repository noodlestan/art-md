import type { ArtCodec } from '@art-md/primitives';

import type { BinConfig } from '../config/types';
import type { CommandIo } from '../io/types';
import type { OperationsLog } from '../operations/types';

export type CommandContext = {
	config: BinConfig;
	codec: ArtCodec;
	operations: OperationsLog;
	io: CommandIo;
};
