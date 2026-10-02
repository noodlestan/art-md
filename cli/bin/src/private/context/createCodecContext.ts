import { createArtCodec } from '@art-md/codec';
import type { ArtCodec } from '@art-md/primitives';

import type { BinConfig } from '../config/types';
import { readInput } from '../io/readInput';
import { writeOutput } from '../io/writeOutput';
import { createOperationsLog } from '../log/createOperationsLog';
import type { OperationsLog } from '../log/createOperationsLog';
import type { LoggerAPI } from '../logger/createLogger';

export type CodecIo = {
	readInput: (path?: string, stdin?: NodeJS.ReadableStream) => Promise<string>;
	writeOutput: (content: string, target?: string) => Promise<void>;
};

export type CodecContext = {
	config: BinConfig;
	codec: ArtCodec;
	log: OperationsLog;
	io: CodecIo;
};

export function createCodecContext(config: BinConfig, logger: LoggerAPI): CodecContext {
	const codec = createArtCodec(config.codec);
	const log = createOperationsLog(logger.log);
	const io = { readInput, writeOutput };

	return { config, codec, log, io };
}
