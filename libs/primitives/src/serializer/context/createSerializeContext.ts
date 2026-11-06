import type { SerializeContext, SerializerContextData } from './types.js';

/** Builds a `SerializeContext` from its data — currently just the target `uri`. */
export function createSerializeContext(data: SerializerContextData): SerializeContext {
	return { uri: data.uri };
}
