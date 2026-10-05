import type { ParseResult } from '@art-md/primitives';

import type { CodecContext } from '../context/createCodecContext';
import { createOperationFailure } from '../operations/createOperationFailure';
import { createOperationSuccess } from '../operations/createOperationSuccess';
import { createParseOperation } from '../operations/createParseOperation';
import { presentDocument } from '../present/presentDocument';

const STDIN_URI = 'stdin';

export type ParseOptions = {
	file?: string;
	write?: string;
};

export type ParseOutcome = ParseResult | null;

export async function doParse(ctx: CodecContext, options: ParseOptions): Promise<ParseOutcome> {
	const uri = options.file ?? STDIN_URI;
	const pending = createParseOperation({ uri });
	ctx.log.log(pending);

	try {
		const content = await ctx.io.readInput(options.file);
		const result = ctx.codec.parse(content);
		ctx.log.log(createOperationSuccess(pending));
		await ctx.io.writeOutput(presentDocument(result.document), options.write);
		return result;
	} catch (error) {
		ctx.log.log(createOperationFailure(pending, error));
		return null;
	}
}
