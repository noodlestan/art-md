import type { SerializeResult } from '@art-md/primitives';

import type { CodecContext } from '../context/createCodecContext';
import { createOperationFailure } from '../operations/createOperationFailure';
import { createOperationSuccess } from '../operations/createOperationSuccess';
import { createSerializeOperation } from '../operations/createSerializeOperation';
import { presentContent } from '../present/presentContent';

import { readDocument } from './private/readDocument';

const STDIN_URI = 'stdin';

export type SerializeOptions = {
	file?: string;
	json?: boolean;
	write?: string;
};

export type SerializeOutcome = SerializeResult | null;

export async function doSerialize(
	ctx: CodecContext,
	options: SerializeOptions,
): Promise<SerializeOutcome> {
	const uri = options.file ?? STDIN_URI;
	const pending = createSerializeOperation({ uri });
	ctx.log.log(pending);

	try {
		const source = await ctx.io.readInput(options.file);
		const document = readDocument(source);
		const result = ctx.codec.serialize(document);
		ctx.log.log(createOperationSuccess(pending));
		const presented = presentContent(result.content, options);
		await ctx.io.writeOutput(presented, options.write);
		return result;
	} catch (error) {
		ctx.log.log(createOperationFailure(pending, error));
		return null;
	}
}
