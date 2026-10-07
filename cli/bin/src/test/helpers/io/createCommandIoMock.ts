import { vi } from 'vitest';

import type { CommandIo } from '../../../private/io/types';

export function createCommandIoMock(content = ''): CommandIo {
	return {
		readInput: vi.fn<CommandIo['readInput']>().mockResolvedValue(content),
		writeOutput: vi.fn<CommandIo['writeOutput']>().mockResolvedValue(undefined),
	};
}
