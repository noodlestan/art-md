import { vi } from 'vitest';

import type { LoggerAPI } from '../../../private/logger/types';

export function createLoggerMock(): LoggerAPI {
	return {
		log: vi.fn<LoggerAPI['log']>(),
		debug: vi.fn<LoggerAPI['log']>(),
		setVerbosity: vi.fn<LoggerAPI['setVerbosity']>(),
	};
}
