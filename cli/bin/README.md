# @art-md/bin

> Parse and serialise Art MD from the command line.

CLI that exposes the Art MD codec, parser, and serializer as commands.

This package is part of the [Art MD](https://art-md.noodlestan.org) project.

## Commands

| command         | bin entry                      | role                                           |
| --------------- | ------------------------------ | ---------------------------------------------- |
| `art-codec`     | `./dist/esm/bin/codec.mjs`     | Run the configured codec over Art MD content.  |
| `art-parse`     | `./dist/esm/bin/parse.mjs`     | Parse Art MD source into an Art MD document.   |
| `art-serialize` | `./dist/esm/bin/serialize.mjs` | Serialize an Art MD document back into source. |

Each command is a self-executing entry point under `src/bin/`, built into its own bundle. The command behaviour is not implemented yet: each command reports that it is not yet implemented and exits non-zero.

The package's public export surface is types only — `src/index.ts` re-exports `ArtCodec`, `ParseResult`, and `SerializeResult` from `@art-md/primitives`. Import the codec itself from `@art-md/codec`.

## Development

Make sure you read the [Art MD README](../../README.md) first.

### Build

This package is meant for use in Node.js environments. The entry points are built using `esbuild` pre-configured by [Workspace Tooling](https://github.com/noodlestan/workspace-tooling), which emits one bundle per `src/**/*.ts` under `dist/esm/` and `dist/cjs/`. The published bins are the `dist/esm/bin/*.mjs` bundles.

### Scripts

Run from this package directory:

- `npm run dev` — rebuild on change
- `npm run build` — produce the full build
- `npm run lint` — report prettier, eslint, and `tsc --noEmit` issues
- `npm run lint:fix` — fix formatting and lint issues
- `npm run test` — run the vitest suite
- `npm run ci` — lint, build, and test with coverage

## License

Copyright (c) 2026 [Noodlestan](https://noodlestan.org/).

Published under a [MIT license](https://noodlestan.mit-license.org/).
