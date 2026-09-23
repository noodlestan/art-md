import type { ContainerConstructBase } from '../../constructs';

import { createParseContext } from './createParseContext';
import { createParserVisitContextBase } from './private/createParserVisitContextBase';
import type { ParseContext, ParserSource, ParserVisitContext } from './types';

export function createParserVisitContext(
	construct: ContainerConstructBase,
	source: ParserSource,
	parseContext: ParseContext = createParseContext({ uri: '' }),
): ParserVisitContext {
	return createParserVisitContextBase(source, construct, undefined, undefined, parseContext);
}
