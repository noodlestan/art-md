import type { LogWriter } from './types';

type ConsoleStream = 'stdout' | 'stderr';

export function createConsoleWriter(stream: ConsoleStream): LogWriter {
	return message => {
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
	};
}
