import type { ContainerConstructBase } from '../../constructs/index.js';

import { createParseContext } from './createParseContext.js';
import { createParserVisitContextBase } from './private/createParserVisitContextBase.js';
import type { ParseContext, ParserSource, ParserVisitContext } from './types.js';

export function createParserVisitContext(
	construct: ContainerConstructBase,
	source: ParserSource,
	parseContext: ParseContext = createParseContext({ uri: '' }),
): ParserVisitContext {
	return createParserVisitContextBase(source, construct, undefined, undefined, parseContext);
}
