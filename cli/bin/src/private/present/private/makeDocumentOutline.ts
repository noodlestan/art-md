const INDENT = '  ';
const LABEL_SEPARATOR = ': ';

type OutlineNode = {
	construct: string;
	children?: OutlineNode[];
	name?: string;
};

function readLabel(node: OutlineNode): string {
	if (node.name === undefined) {
		return node.construct;
	}
	return `${node.construct}${LABEL_SEPARATOR}${node.name}`;
}

function makeLines(node: OutlineNode, depth: number): string[] {
	const indent = INDENT.repeat(depth);
	const lines = [`${indent}${readLabel(node)}`];

	for (const child of node.children ?? []) {
		const childLines = makeLines(child, depth + 1);
		lines.push(...childLines);
	}
	return lines;
}

export function makeDocumentOutline(document: OutlineNode): string[] {
	return makeLines(document, 0);
}
