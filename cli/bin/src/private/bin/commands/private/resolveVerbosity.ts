import { isValidVerbosity } from '../../../logger/isValidVerbosity.js';
import type { LogVerbosity } from '../../../logger/types.js';

export function resolveVerbosity(
	configuredMode: LogVerbosity,
	requestedMode: string | undefined,
): LogVerbosity {
	if (isValidVerbosity(requestedMode)) {
		return requestedMode;
	}
	return configuredMode;
}
