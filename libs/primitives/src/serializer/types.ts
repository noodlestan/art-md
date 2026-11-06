import type { SerializeContext } from './context/index.js';

/** The serialized markdown `content` paired with the `SerializeContext` it was produced with. */
export interface SerializeResult {
	content: string;
	context: SerializeContext;
}
