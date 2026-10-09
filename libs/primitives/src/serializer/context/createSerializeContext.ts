import type { SerializeContext, SerializerContextData } from './types.js';

export function createSerializeContext(data: SerializerContextData): SerializeContext {
	return { uri: data.uri };
}
