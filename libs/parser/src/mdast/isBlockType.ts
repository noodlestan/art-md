import { BLOCK_TYPES } from './constants.js';

export function isBlockType(type: string): boolean {
	return BLOCK_TYPES.has(type);
}
