import { createArtCodec } from '@art-md/codec';

import type { BinConfig } from '../config/types';
import { createCommandIo } from '../io/createCommandIo';
import { type LoggerAPI } from '../logger/types';
import { createOperationsLog } from '../operations/createOperationsLog';

import type { CommandContext } from './types';

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
