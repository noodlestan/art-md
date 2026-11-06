/**
 * The context a serialization carries, and the factory that builds it — reach
 * for it when writing markdown back rather than parsing it.
 */
export { createSerializeContext } from './createSerializeContext.js';

export type { SerializeContext, SerializerContextData } from './types.js';
