import type { PartialBinConfig } from '../../private/config/types';
import { type CodecContext, createCodecContext } from '../../private/context/createCodecContext';
import { createLogger } from '../../private/logger/createLogger';

import { makeConfigMock } from './makeConfigMock';

export function makeCodecContextMock(overrides: PartialBinConfig = {}): CodecContext {
	const config = makeConfigMock(overrides);
	const logger = createLogger();
	return createCodecContext(config, logger);
}
