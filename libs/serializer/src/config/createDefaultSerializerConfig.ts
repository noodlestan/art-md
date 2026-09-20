import { CONSTRUCT_SERIALIZERS } from '@art-md/constructs';

import type { SerializerConfig } from './types';

export function createDefaultSerializerConfig(): SerializerConfig {
	return {
		constructs: CONSTRUCT_SERIALIZERS,
	};
}
