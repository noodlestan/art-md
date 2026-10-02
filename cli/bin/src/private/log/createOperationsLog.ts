import type { Operation } from '../operations/types';

export type OperationsLog = {
	log: (operation: Operation) => void;
	all: () => Operation[];
};

export function createOperationsLog(logger: (operation: Operation) => void): OperationsLog {
	const operations: Operation[] = [];

	return {
		log(operation: Operation): void {
			logger(operation);

			if (operation.outcome !== 'pending') {
				operations.push(operation);
			}
		},

		all(): Operation[] {
			return [...operations];
		},
	};
}
