import type { LogMessage, LogVerbosity } from '../types.js';

export function shouldWrite(mode: LogVerbosity | undefined, message: LogMessage): boolean {
	if (mode === 'quiet') {
		return false;
	}
	if (mode === 'verbose') {
		return true;
	}
	return message.level === 'log';
}
