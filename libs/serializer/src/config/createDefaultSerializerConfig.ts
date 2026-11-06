import { CONSTRUCT_SERIALIZERS } from '@art-md/constructs';

import type { SerializerConfig } from './types.js';

/** Builds a `SerializerConfig` seeded with the constructs' own serializer registry. */
export function createDefaultSerializerConfig(): SerializerConfig {
	return {
		constructs: CONSTRUCT_SERIALIZERS,
	};
}
