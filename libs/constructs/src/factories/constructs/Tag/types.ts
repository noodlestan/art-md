import type { ConstructBase } from '@art-md/primitives';

/** A named tag record: the `(#name)` annotation other constructs store in `tags`. */
export type Tag = ConstructBase & {
	construct: 'Tag';
	name: string;
};
