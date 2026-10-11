# Art MD Bin - Entry Points

**Purpose:** Describe the three executables and how source maps to `dist/`.

## Executables

| bin             | source                 | bundle               |
| --------------- | ---------------------- | -------------------- |
| `art-codec`     | `src/bin/codec.ts`     | `dist/codec.mjs`     |
| `art-parse`     | `src/bin/parse.ts`     | `dist/parse.mjs`     |
| `art-serialize` | `src/bin/serialize.ts` | `dist/serialize.mjs` |

The mapping is declared in `package.json` under `bin`. Each source file starts with `#!/usr/bin/env node`.

## Registration

`art-parse` and `art-serialize` are single-operation programs: `buildSingleOperationProgram` takes the program's name, description, argument, options, and action, so the program has no subcommands.

`art-codec` registers `parse` and `serialize` as subcommands through `buildProgram`. Both subcommands are built from the same `configureParseCommand` and `configureSerializeCommand` wiring the single-operation programs use, so the argument and options match.

## Build

`build.config.mjs` lists the three entry points and inlines `__BUILD_VERSION__` from `package.json`. The bundles are self-executing: each parses `process.argv` on load. `commander` is the only external runtime dependency; `@art-md/codec` and `@art-md/primitives` are bundled into each executable.

The version reported by `--version` is the `package.json` version at build time, not the one on disk when the bundle runs.
