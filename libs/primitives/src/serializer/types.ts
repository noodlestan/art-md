import type { SerializeContext } from './context';

export interface SerializeResult {
	content: string;
	context: SerializeContext;
}
