export type CommandIo = {
	readInput: (path?: string, stdin?: NodeJS.ReadableStream) => Promise<string>;
	writeOutput: (content: string, target?: string) => Promise<void>;
};
