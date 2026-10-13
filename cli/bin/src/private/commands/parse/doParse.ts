import type { ParseResult } from '@art-md/primitives';

import type { CommandContext } from '../../context/types.js';
import { runOperation } from '../private/runOperation.js';

import { createParseOperation } from './private/createParseOperation.js';
import { executeParse } from './private/executeParse.js';

type ParseOptions = {
	file?: string;
	write?: string;
};

type ParseOutcome = ParseResult | null;

export async function doParse(ctx: CommandContext, options: ParseOptions): Promise<ParseOutcome> {
	return runOperation(ctx, options, createParseOperation, executeParse);
}
