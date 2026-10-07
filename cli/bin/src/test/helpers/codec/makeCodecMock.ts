import type { ArtCodec } from '@art-md/primitives';
import { vi } from 'vitest';

export function makeCodecMock(): ArtCodec {
	const parse = vi.fn<ArtCodec['parse']>();
	const serialize = vi.fn<ArtCodec['serialize']>();

	return { parse, serialize } as unknown as ArtCodec;
}
