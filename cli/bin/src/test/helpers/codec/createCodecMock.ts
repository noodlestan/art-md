import type { ArtCodec } from '@art-md/primitives';
import { vi } from 'vitest';

/** @mocks ArtCodec */
export function createCodecMock(): ArtCodec {
	const parse = vi.fn<ArtCodec['parse']>();
	const serialize = vi.fn<ArtCodec['serialize']>();

	return {
		parse,
		serialize,
	} as unknown as ArtCodec;
}
