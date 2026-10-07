export type LogVerbosity = 'quiet' | 'default' | 'verbose';

export type LogMessage = {
	level: LogLevel;
	args: unknown[];
};

export type LogLevel = 'log' | 'debug';

export type LogWriter = (message: LogMessage) => void;

export type LoggerAPI = {
	log: (...args: unknown[]) => void;
	debug: (...args: unknown[]) => void;
	setVerbosity: (mode: LogVerbosity) => void;
};
