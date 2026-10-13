import type { LogMessage, LogVerbosity, LogWriter } from '../types.js';

import { shouldWrite } from './shouldWrite.js';

export function flushMessages(
	messages: LogMessage[],
	mode: LogVerbosity | undefined,
	write: LogWriter,
): void {
	for (const message of messages) {
		if (shouldWrite(mode, message)) {
			write(message);
		}
	}
	messages.length = 0;
}
