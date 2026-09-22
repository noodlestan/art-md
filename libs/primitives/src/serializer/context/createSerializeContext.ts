import type { SerializeContext, SerializerContextData } from './types';

export function createSerializeContext(data: SerializerContextData): SerializeContext {
	return { uri: data.uri };
}
