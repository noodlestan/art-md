/**
 * The `@art-md/serializer` public surface.
 *
 * Re-exports `serialize` — the entry point that turns an
 * {@link @art-md/primitives:document#ArtDocument} back into markdown — plus the
 * default configuration that drives it.
 */
export { createDefaultSerializerConfig } from './config/index.js';
export { serialize } from './serializer/index.js';

export type { SerializerConfig } from './config/index.js';
