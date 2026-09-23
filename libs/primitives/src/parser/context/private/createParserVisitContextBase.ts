import type { ConstructBase, ContainerConstructBase } from '../../../constructs';
import { createParseContext } from '../createParseContext';
import type { OnBeforeConstruct, ParseContext, ParserSource, ParserVisitContext } from '../types';

export function createParserVisitContextBase(
	source: ParserSource,
	construct: ContainerConstructBase,
	parentContext: ParserVisitContext | undefined,
	onBeforeConstruct?: OnBeforeConstruct,
	parseContext: ParseContext = createParseContext({ uri: '' }),
): ParserVisitContext {
	const context: ParserVisitContext = {
		construct,
		source,
		parseContext,
		captureChildConstruct(child: ConstructBase) {
			construct.children.push(child);
		},
		onBeforeConstruct(construct: ConstructBase) {
			return onBeforeConstruct ? onBeforeConstruct(construct, context) : context;
		},
		childContext(construct: ContainerConstructBase, onBeforeConstruct?: OnBeforeConstruct) {
			return createParserVisitContextBase(
				source,
				construct,
				context,
				onBeforeConstruct,
				parseContext,
			);
		},
		parent() {
			return parentContext;
		},
	};

	return context;
}
