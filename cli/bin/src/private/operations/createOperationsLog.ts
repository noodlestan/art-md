import type { LoggerAPI } from '../logger/types.js';
import { makeOperationLogLine } from '../presentation/makeOperationLogLine.js';

import type { Operation, OperationsLog } from './types.js';

export type { Operation, OperationsLog } from './types.js';

export function createOperationsLog(logger: LoggerAPI): OperationsLog {
	const operations: Operation[] = [];

	return {
		log(operation: Operation): void {
			if (operation.outcome !== 'pending') {
				logger.log(...makeOperationLogLine(operation, { standalone: true }));
				operations.push(operation);
			} else {
				logger.debug(...makeOperationLogLine(operation, { standalone: true }));
			}
		},

		all(): Operation[] {
			return [...operations];
		},
	};
}
