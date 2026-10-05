import type { Operation } from '../operations/types';
import { makeOperationLogLine } from '../present/makeOperationLogLine';

export type LoggerAPI = {
	log: (op: Operation) => void;
	setOutputMode: (mode: string | undefined) => void;
};

type OutputMode = 'quiet' | 'verbose';

function isOutputMode(mode: string | undefined): mode is OutputMode {
	return mode === 'quiet' || mode === 'verbose';
}

export function createLogger(): LoggerAPI {
	let mode: OutputMode | undefined;
	const buffer: Operation[] = [];

	function isLogged(op: Operation): boolean {
		return op.outcome !== 'pending' || mode === 'verbose';
	}

	function write(op: Operation): void {
		const line = makeOperationLogLine(op, { standalone: true });
		console.error(line.join(' | '));
	}

	function flush(): void {
		for (const op of buffer) {
			if (isLogged(op)) {
				write(op);
			}
		}
		buffer.length = 0;
	}

	return {
		log(op: Operation): void {
			if (mode === undefined) {
				buffer.push(op);
				return;
			}
			if (isLogged(op)) {
				write(op);
			}
		},

		setOutputMode(newMode: string | undefined): void {
			mode = isOutputMode(newMode) ? newMode : 'quiet';

			if (mode === 'verbose') {
				flush();
				return;
			}
			// quiet discards the buffered operations, pending ones included
			buffer.length = 0;
		},
	};
}
