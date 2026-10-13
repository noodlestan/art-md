import type { LogMessage, LogWriter } from './types.js';

type ConsoleStream = 'stdout' | 'stderr';

export function createConsoleWriter(stream: ConsoleStream): LogWriter {
	function writeMessage(message: LogMessage): void {
		if (stream === 'stderr') {
			console.error(...message.args);
			return;
		}

		if (message.level === 'debug') {
			// eslint-disable-next-line no-console
			console.debug(...message.args);
			return;
		}

		console.info(...message.args);
	}

	return writeMessage;
}
