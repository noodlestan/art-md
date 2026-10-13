import { vi } from 'vitest';

import type { Operation, OperationsLog } from '../../../private/operations/types.js';

/** @mocks OperationsLog */
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
