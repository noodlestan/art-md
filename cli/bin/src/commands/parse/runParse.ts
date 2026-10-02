import { type ParseOptions, type ParseOutcome, doParse } from '../../private/commands/doParse';
import type { CodecContext } from '../../private/context/createCodecContext';
import { createGenericOperation } from '../../private/operations/createGenericOperation';

export async function runParse(ctx: CodecContext, options: ParseOptions): Promise<ParseOutcome> {
	ctx.log.log(createGenericOperation('command', ['parse', options]));

	return doParse(ctx, options);
}
