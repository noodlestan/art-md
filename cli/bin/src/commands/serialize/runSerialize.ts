import {
	type SerializeOptions,
	type SerializeOutcome,
	doSerialize,
} from '../../private/commands/doSerialize';
import type { CodecContext } from '../../private/context/createCodecContext';
import { createGenericOperation } from '../../private/operations/createGenericOperation';

export async function runSerialize(
	ctx: CodecContext,
	options: SerializeOptions,
): Promise<SerializeOutcome> {
	ctx.log.log(createGenericOperation('command', ['serialize', options]));

	return doSerialize(ctx, options);
}
