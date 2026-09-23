import { createArtCodec } from '@art-md/codec';
import type { ArtCodec } from '@art-md/primitives';

export function makeCodec(): ArtCodec {
	return createArtCodec();
}
