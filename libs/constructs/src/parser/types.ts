/* eslint-disable @typescript-eslint/no-explicit-any */

import type { MdastNode, ParserVisitContext } from '@art-md/primitives';

import type { Construct } from '../factories/index.js';

/** The parse step that turns a node and visit context into a construct, or `null` when it does not apply. */
export type ConstructProcessor = {
	captureNode(context: ParserVisitContext, node: MdastNode): Construct | null;
};

/** The parse step that folds a captured construct back into the visit context. */
export type ConstructIntegrator = {
	integrate(context: ParserVisitContext, node: MdastNode, construct: Construct): ParserVisitContext;
};

/** A named parse unit pairing an optional processor with an optional integrator. */
export type ConstructParser = {
	readonly name: string;
	processor?: ConstructProcessor;
	integrator?: ConstructIntegrator;
};

/** Creates a fresh `ConstructParser`. */
export type ConstructParserFactory = () => ConstructParser;
