import type { SerializeContext } from './context/index.js';

export interface SerializeResult {
	content: string;
	context: SerializeContext;
}
