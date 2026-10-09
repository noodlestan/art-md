import { vi } from 'vitest';

import type { Operation, OperationsLog } from '../../../private/operations/createOperationsLog.js';

export function createOperationsLogMock(): OperationsLog {
	const operations: Operation[] = [];

	return {
		log: vi.fn<OperationsLog['log']>(operation => {
			if (operation.outcome !== 'pending') {
				operations.push(operation);
			}
		}),
		all: () => [...operations],
	};
}
