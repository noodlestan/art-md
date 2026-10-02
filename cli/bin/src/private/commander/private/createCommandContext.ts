import { loadBinConfig } from '../../config/loadBinConfig';
import { type CodecContext, createCodecContext } from '../../context/createCodecContext';
import { createLogger } from '../../logger/createLogger';

export function createCommandContext(outputMode: string | undefined): CodecContext {
	const logger = createLogger();
	const config = loadBinConfig();
	const ctx = createCodecContext(config, logger);
	logger.setOutputMode(outputMode ?? config.output.mode);

	return ctx;
}
