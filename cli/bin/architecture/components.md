# Components: Art MD Bin

**Purpose:** Identify the components of the bin package and how they connect.

## Programs

`buildSingleOperationProgram` assembles `art-parse` and `art-serialize`. `buildProgram` assembles `art-codec` from `buildParseCommand` and `buildSerializeCommand`. Both use the same `configureParseCommand` and `configureSerializeCommand` wiring.

## Commands

`runParse` and `runSerialize` open each invocation with a `command` operation, then `doParse` and `doSerialize` read input, run the codec, and write the result.

## Context

`createCodecContext` brings config, codec, log, and io together. `createCommandContext` builds that context per invocation and applies the output mode.

## IO

`readInput` and `writeOutput` are the only file access. Stdin and stdout sit behind them in `io/private`.

## Operations

Operation records, `createLogger`, `createOperationsLog`, and `makeOperationLogLine` cover everything written to stderr.

## Present

`presentDocument` formats the document as JSON. `makeOperationLogLine` formats the log cells.

## Config

`loadBinConfig` provides the build-time version and the default output mode.
