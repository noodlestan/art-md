import { CONSTRUCT_SERIALIZERS } from '@art-md/constructs';

import type { SerializerConfig } from './types.js';

export function createDefaultSerializerConfig(): SerializerConfig {
	return {
		constructs: CONSTRUCT_SERIALIZERS,
	};
}
