import type { CommandContext } from '../../../private/context/types';
import { makeConfigFixture } from '../config/makeConfigFixture';
import { createCommandIoMock } from '../io/createCommandIoMock';
import { createOperationsLogMock } from '../operations/createOperationsLogMock';

import { makeCodecMock } from './makeCodecMock';

export function createCommandContextMock(parts: Partial<CommandContext> = {}): CommandContext {
	const config = parts.config ?? makeConfigFixture();
	const codec = parts.codec ?? makeCodecMock();
	const operations = parts.operations ?? createOperationsLogMock();
	const io = parts.io ?? createCommandIoMock();

	return { config, codec, operations, io };
}
