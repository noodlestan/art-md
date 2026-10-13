import type { LogVerbosity } from './types.js';

export function isValidVerbosity(verbosity: string | undefined): verbosity is LogVerbosity {
	return verbosity === 'quiet' || verbosity === 'default' || verbosity === 'verbose';
}
