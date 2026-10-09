import type { ParseResult } from '@art-md/primitives';

import type { CommandContext } from '../../context/types.js';
import { createOperationFailure } from '../../operations/createOperationFailure.js';
import { createOperationSuccess } from '../../operations/createOperationSuccess.js';
import { presentDocument } from '../../presentation/presentDocument.js';

import { createParseOperation } from './private/createParseOperation.js';

const STDIN_URI = 'stdin';

export type ParseOptions = {
	file?: string;
	write?: string;
};

export type ParseOutcome = ParseResult | null;

export async function doParse(ctx: CommandContext, options: ParseOptions): Promise<ParseOutcome> {
	const uri = options.file ?? STDIN_URI;
	const pending = createParseOperation({ uri });
	ctx.operations.log(pending);

	try {
		const content = await ctx.io.readInput(options.file);
		const result = ctx.codec.parse(content);
		ctx.operations.log(createOperationSuccess(pending));
		await ctx.io.writeOutput(presentDocument(result.document), options.write);
		return result;
	} catch (error) {
		ctx.operations.log(createOperationFailure(pending, error));
		return null;
	}
}
