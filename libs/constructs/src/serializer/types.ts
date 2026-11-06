import type { Node } from 'mdast';

import type { Construct } from '../factories/index.js';

/**
 * The contract a construct serializer implements: a `name` plus a `toMdast`
 * that rebuilds a node from the construct and its children.
 */
export type ConstructSerializer = {
	readonly name: string;
	toMdast(node: Construct, children: Node[]): Node;
};

/** Creates a fresh `ConstructSerializer`. */
export type ConstructSerializerFactory = () => ConstructSerializer;
