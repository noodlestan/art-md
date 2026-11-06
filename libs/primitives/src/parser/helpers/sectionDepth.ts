/** Returns a heading's depth, treating a node that carries none as depth 1. */
export function sectionDepth(section: { depth?: number }): number {
	return section.depth ?? 1;
}
