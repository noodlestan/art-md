import type { ArtDocument, SerializeResult } from '@art-md/primitives';

import type { CommandContext } from '../../context/types';
import { createOperationFailure } from '../../operations/createOperationFailure';
import { createOperationSuccess } from '../../operations/createOperationSuccess';

import { createSerializeOperation } from './private/createSerializeOperation';

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
