# Art MD Bin - Context Model

**Purpose:** Describe `CodecContext`, `loadBinConfig`, and `createCommandContext`.

`CodecContext` is what an operation works with:

- `config` — version, output mode, and codec settings from `loadBinConfig`.
- `codec` — the Art Codec created by `createArtCodec`.
- `log` — an operations log writing through the logger.
- `io` — `readInput` and `writeOutput`.

`createCodecContext(config, logger)` builds it. `createCommandContext(outputMode)` builds it per invocation: it loads the config, creates the logger, and applies the `--output` value, falling back to the configured mode.

`loadBinConfig` reads `__BUILD_VERSION__` inlined at build time and defaults the output mode to `quiet`.
