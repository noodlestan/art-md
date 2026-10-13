import { flushMessages } from './private/flushMessages.js';
import { shouldWrite } from './private/shouldWrite.js';
import type { LogMessage, LogVerbosity, LogWriter, LoggerAPI } from './types.js';

export function createLogger(write: LogWriter): LoggerAPI {
	let mode: LogVerbosity | undefined;
	const bufferedMessages: LogMessage[] = [];

	return {
		log(...args: unknown[]): void {
			const message = { level: 'log' as const, args };

			if (mode === undefined) {
				bufferedMessages.push(message);
				return;
			}

			if (shouldWrite(mode, message)) {
				write(message);
			}
		},

		debug(...args: unknown[]): void {
			const message = { level: 'debug' as const, args };

			if (mode === undefined) {
				bufferedMessages.push(message);
				return;
			}

			if (shouldWrite(mode, message)) {
				write(message);
			}
		},

		setVerbosity(newMode: LogVerbosity): void {
			mode = newMode;

			if (mode === 'verbose') {
				flushMessages(bufferedMessages, mode, write);
				return;
			}

			bufferedMessages.length = 0;
		},
	};
}
