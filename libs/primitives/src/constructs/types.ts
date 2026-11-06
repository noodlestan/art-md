import type { Position } from '../parser/index.js';

/** The shape every construct implements: a discriminator plus an optional source position. */
export type ConstructBase = {
	/** Discriminator — the construct class (e.g. 'SectionBlock'). */
	construct: string;
	/** Source position, carried from the visited mdast nodes. */
	position?: Position;
};

/** A construct that holds child constructs — a document, a section, a list. */
export type ContainerConstructBase = ConstructBase & {
	children: ConstructBase[];
};

/** Reads raw data and returns a single construct of the bound type. */
export type ConstructFactory<T extends ConstructBase> = {
	fromData(data: unknown): T;
};
