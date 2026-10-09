import { createArtCodec } from '@art-md/codec';

import type { BinConfig } from '../config/types.js';
import { createCommandIo } from '../io/createCommandIo.js';
import { type LoggerAPI } from '../logger/types.js';
import { createOperationsLog } from '../operations/createOperationsLog.js';

import type { CommandContext } from './types.js';

export function createCommandContext(config: BinConfig, logger: LoggerAPI): CommandContext {
	const codec = createArtCodec(config.codec);
	const operations = createOperationsLog(logger);
	const io = createCommandIo();

	return {
		config,
		codec,
		operations,
		io,
	};
}
