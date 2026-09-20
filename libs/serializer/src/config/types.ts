import type { ConstructSerializerFactory } from '@art-md/constructs';

export type SerialisableNode = {
	construct: string;
	children?: unknown[];
	value?: unknown;
};

export type SerializerConfig = {
	constructs: ConstructSerializerFactory[];
};
