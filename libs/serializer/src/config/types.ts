import type { ConstructSerializerFactory } from '@art-md/constructs';

/** Any construct node the walk can visit — tagged with its `construct`, optionally carrying `children` or `value`. */
export type SerialisableNode = {
	construct: string;
	children?: unknown[];
	value?: unknown;
};

/** The {@link @art-md/constructs:serializer#ConstructSerializerFactory} entries that map each construct to mdast. */
export type SerializerConfig = {
	constructs: ConstructSerializerFactory[];
};
