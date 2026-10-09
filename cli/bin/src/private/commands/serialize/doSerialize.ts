import type { ArtDocument, SerializeResult } from '@art-md/primitives';

import type { CommandContext } from '../../context/types.js';
import { createOperationFailure } from '../../operations/createOperationFailure.js';
import { createOperationSuccess } from '../../operations/createOperationSuccess.js';

import { createSerializeOperation } from './private/createSerializeOperation.js';

const STDIN_URI = 'stdin';

export type SerializeOptions = {
	file?: string;
	write?: string;
};

export type SerializeOutcome = SerializeResult | null;

export async function doSerialize(
	ctx: CommandContext,
	options: SerializeOptions,
): Promise<SerializeOutcome> {
	const uri = options.file ?? STDIN_URI;
	const pending = createSerializeOperation({ uri });
	ctx.operations.log(pending);

	try {
		const source = await ctx.io.readInput(options.file);
		const document = JSON.parse(source) as ArtDocument;
		const result = ctx.codec.serialize(document);
		ctx.operations.log(createOperationSuccess(pending));
		await ctx.io.writeOutput(result.content, options.write);
		return result;
	} catch (error) {
		ctx.operations.log(createOperationFailure(pending, error));
		return null;
	}
}
