import type { SerializeResult } from '@art-md/primitives';

import type { CommandContext } from '../../context/types.js';
import { runOperation } from '../private/runOperation.js';

import { createSerializeOperation } from './private/createSerializeOperation.js';
import { executeSerialize } from './private/executeSerialize.js';

type SerializeOptions = {
	file?: string;
	write?: string;
};

type SerializeOutcome = SerializeResult | null;

export async function doSerialize(
	ctx: CommandContext,
	options: SerializeOptions,
): Promise<SerializeOutcome> {
	return runOperation(ctx, options, createSerializeOperation, executeSerialize);
}
