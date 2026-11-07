/**
 * The codec — one object that runs the Art MD round trip: markdown in, an
 * {@link @art-md/primitives:document#ArtDocument} out, markdown back. Reach for
 * `createArtCodec` when a document must travel both directions with the default
 * construct registries already wired; call
 * {@link @art-md/parser:parse#parse} and
 * {@link @art-md/serializer:serializer#serialize} directly when only one half
 * of the trip is needed, or when each side is configured on its own.
 */
export { createArtCodec } from './createArtCodec.js';

export type { ArtCodecConfig, PartialArtCodecConfig } from './types.js';
