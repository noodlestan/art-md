# Architecture: Art MD Bin

## Documents

| Document                       | Purpose                                                                  |
| ------------------------------ | ------------------------------------------------------------------------ |
| [overview.md](overview.md)     | What the package is, definitions, use cases, and how an invocation works |
| [components.md](components.md) | Components of the package and how they connect                           |

## Design Documents

| Document                                           | Purpose                                                       |
| -------------------------------------------------- | ------------------------------------------------------------- |
| [design/entry-points.md](design/entry-points.md)   | The three executables and how source maps to `dist/`          |
| [design/commands.md](design/commands.md)           | Command surface, options, streams, exit codes, and edge cases |
| [design/operations.md](design/operations.md)       | Operation records, logging, and the log line format           |
| [design/context-model.md](design/context-model.md) | `CodecContext`, `loadBinConfig`, and `createCommandContext`   |
| [design/dependencies.md](design/dependencies.md)   | Runtime dependencies and what the bundle keeps external       |

## Decision Records

| Record                                       | Purpose                                  |
| -------------------------------------------- | ---------------------------------------- |
| [adr/cli.art](adr/cli.art)                   | Shape of the command surface             |
| [adr/distribution.art](adr/distribution.art) | How the package is built and distributed |
| [adr/test.art](adr/test.art)                 | How the package is tested                |
