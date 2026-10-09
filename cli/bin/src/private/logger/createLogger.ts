import type { LogMessage, LogVerbosity, LogWriter, LoggerAPI } from './types.js';

export function createLogger(write: LogWriter): LoggerAPI {
	let mode: LogVerbosity | undefined;
	const buffer: LogMessage[] = [];

	function shouldWrite(message: LogMessage): boolean {
		if (mode === 'quiet') {
			return false;
		}
		if (mode === 'verbose') {
			return true;
		}
		return message.level === 'log';
	}

	function flush(): void {
		for (const message of buffer) {
			if (shouldWrite(message)) {
				write(message);
			}
		}
		buffer.length = 0;
	}

	return {
		log(...args: unknown[]): void {
			const message = { level: 'log' as const, args };

			if (mode === undefined) {
				buffer.push(message);
				return;
			}

			if (shouldWrite(message)) {
				write(message);
			}
		},

		debug(...args: unknown[]): void {
			const message = { level: 'debug' as const, args };

			if (mode === undefined) {
				buffer.push(message);
				return;
			}

			if (shouldWrite(message)) {
				write(message);
			}
		},

		setVerbosity(newMode: LogVerbosity): void {
			mode = newMode;

			if (mode === 'verbose') {
				flush();
				return;
			}

			buffer.length = 0;
		},
	};
}
