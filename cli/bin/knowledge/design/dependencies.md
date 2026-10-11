# Art MD Bin - Dependencies

**Purpose:** Describe the runtime dependencies and what the bundle keeps external.

## Runtime

- `@art-md/codec` — `createArtCodec`, the parse and serialize implementation.
- `@art-md/primitives` — types such as `ArtDocument` and `ArtCodec`.
- `commander` — argument parsing. It is the only dependency kept external in the bundles.

## Node

`node:fs/promises`, `node:process`, and `node:stream/consumers` cover file IO, exit codes, and reading stdin.

## Development

No devDependencies here; lint, build, and test tooling comes from the workspace root.
