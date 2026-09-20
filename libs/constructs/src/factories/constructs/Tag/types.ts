import type { ConstructBase } from '@art-md/primitives';

export type Tag = ConstructBase & {
	construct: 'Tag';
	name: string;
};
