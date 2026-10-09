import type { LogVerbosity } from './types.js';

export function validateVerbosity(verbosity: string | undefined): verbosity is LogVerbosity {
	return verbosity === 'quiet' || verbosity === 'default' || verbosity === 'verbose';
}
