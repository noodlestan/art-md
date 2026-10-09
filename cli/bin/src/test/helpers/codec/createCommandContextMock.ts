import type { CommandContext } from '../../../private/context/types.js';
import { makeConfigFixture } from '../config/makeConfigFixture.js';
import { createCommandIoMock } from '../io/createCommandIoMock.js';
import { createOperationsLogMock } from '../operations/createOperationsLogMock.js';

import { makeCodecMock } from './makeCodecMock.js';

export function createCommandContextMock(parts: Partial<CommandContext> = {}): CommandContext {
	const config = parts.config ?? makeConfigFixture();
	const codec = parts.codec ?? makeCodecMock();
	const operations = parts.operations ?? createOperationsLogMock();
	const io = parts.io ?? createCommandIoMock();

	return { config, codec, operations, io };
}
