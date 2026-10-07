import type { LoggerAPI } from '../logger/types';
import { makeOperationLogLine } from '../presentation/makeOperationLogLine';

import type { Operation, OperationsLog } from './types';

export type { Operation, OperationsLog } from './types';

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
