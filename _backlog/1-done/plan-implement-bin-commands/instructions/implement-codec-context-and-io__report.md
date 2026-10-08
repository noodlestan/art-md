# Sub-Agent REPORT (#producer)

**Plan:** `implement-bin-commands`

**Iteration Id:** `implement-codec-context-and-io`

**Outcome:** `COMPLETED`

## Evidence

### Changes

| Goal                                            | Change                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Give the operations a config to run in          | Added `config/types.ts` — `OutputMode` (`quiet` \| `verbose`), `BinConfig { version, output.mode, codec }` and `PartialBinConfig` — and `config/loadBinConfig.ts`, which merges defaults (`version` from the package manifest, `output.mode: 'quiet'`, empty `codec`) with optional user overrides. No config file format: the bin owns no config file.                                                                                                                                                |
| Report the right version in dev and after build | Added `config/private/readPackageVersion.ts`, which walks up from the module's own directory to the first `package.json` named `@art-md/bin` and returns its `version`. A static `import … from '../../../package.json'` was implemented first and rejected: the build's `esbuild-plugin-file-path-extensions` marks every non-JS-like import external, so the JSON path stayed relative to the output and resolved to a non-existent `dist/package.json`.                                             |
| Give the operations a codec                     | Added `context/createCodecContext.ts` — `CodecContext { config, codec, log, io }` — composing `ArtCodec` from `createArtCodec(config.codec)`, an operations log over the logger, and the I/O helpers.                                                                                                                                                                                                                                                                                                  |
| Report progress through the operations log      | Added `log/createOperationsLog.ts` — `OperationsLog { log, all }` — mirroring the Art Work log: every operation reaches the logger, only resolved ones are retained. It was unplanned but required by Step 2's "attach operations log over the logger"; the `Operation` union landed with the previous iteration.                                                                                                                                                                                      |
| Read files or stdin                             | Added `io/readInput.ts` — a file path is read with `node:fs/promises`; `-` or an absent path routes to `io/private/readStdin.ts`, which drains `process.stdin` through `node:stream/consumers`. It takes an optional stream so the stdin path is testable without mocking `process.stdin`.                                                                                                                                                                                                             |
| Write stdout or a `--write` target              | Added `io/writeOutput.ts` — an absent target writes through `io/private/writeStdout.ts` (awaiting the stdout flush callback), a target is written with `node:fs/promises`.                                                                                                                                                                                                                                                                                                                             |
| Render a document and serialised content        | Added `present/presentDocument.ts` and `presentContent.ts` plus `present/types.ts` (`PresentOptions { json? }`, `JSON_INDENT`) and `present/private/makeDocumentOutline.ts`. `json` set renders indented JSON (`{ content }` for content); otherwise `presentDocument` renders a construct outline — one indented line per construct, `Construct: name` when the construct carries a name.                                                                                                             |
| Lock the behaviour with unit tests              | Added `loadBinConfig.test.ts` (5), `readPackageVersion.test.ts` (2), `createCodecContext.test.ts` (6), `readInput.test.ts` (5), `writeOutput.test.ts` (2), `presentDocument.test.ts` (4) and `presentContent.test.ts` (3), plus the three mock helpers `makeConfigMock.ts`, `makeCodecContextMock.ts` and `makeTempDir.ts`. The presentation tests are an addition beyond Step 6's list — without them the new modules pull the package below the enforced coverage thresholds and `npm run ci` fails. |

#### Files changed

- `$PROJECT/cli/bin/src/private/config/types.ts` — New: `OutputMode`, `BinConfig`, `PartialBinConfig`. `output` and `codec` overrides are full-object optionals rather than nested partials, so a mock can spread them over the defaults and stay type-safe.
- `$PROJECT/cli/bin/src/private/config/loadBinConfig.ts` — New: `loadBinConfig(overrides?)` merging the package defaults with user overrides.
- `$PROJECT/cli/bin/src/private/config/private/readPackageVersion.ts` — New: `readPackageVersion(from?)` walking up to the `@art-md/bin` manifest. The default `from` is `dirname(fileURLToPath(import.meta.url))`, falling back to `dirname(__filename)` so the CJS bundle works too.
- `$PROJECT/cli/bin/src/private/config/private/readPackageVersion.test.ts` — New: 2 tests over the found version and the not-found error.
- `$PROJECT/cli/bin/src/private/config/loadBinConfig.test.ts` — New: 5 tests over the defaults, the output-mode override, the codec override, and stability.
- `$PROJECT/cli/bin/src/private/context/createCodecContext.ts` — New: `CodecIo`, `CodecContext`, and `createCodecContext(config, logger)` composing codec, log, and io.
- `$PROJECT/cli/bin/src/private/context/createCodecContext.test.ts` — New: 6 tests including that codec config overrides reach the codec (`{ constructs: [] }` yields no children where the default yields a `SectionBlock`) and that `log` forwards to the logger while keeping resolved operations only.
- `$PROJECT/cli/bin/src/private/log/createOperationsLog.ts` — New: `OperationsLog { log, all }` and `createOperationsLog(logger)`.
- `$PROJECT/cli/bin/src/private/io/readInput.ts` — New: `readInput(path?, stdin?)` — file, `-`, or absent for stdin.
- `$PROJECT/cli/bin/src/private/io/private/readStdin.ts` — New: `readStdin(stdin = process.stdin)` draining the stream as text.
- `$PROJECT/cli/bin/src/private/io/readInput.test.ts` — New: 5 tests over the file, missing-file, `-`, absent-path, and multi-chunk-stdin branches, using `makeTempDir`.
- `$PROJECT/cli/bin/src/private/io/writeOutput.ts` — New: `writeOutput(content, target?)` — stdout or file.
- `$PROJECT/cli/bin/src/private/io/private/writeStdout.ts` — New: `writeStdout(content)` awaiting the stdout write callback.
- `$PROJECT/cli/bin/src/private/io/writeOutput.test.ts` — New: 2 tests — a real temp-file write, and stdout via a `process.stdout.write` spy.
- `$PROJECT/cli/bin/src/private/present/types.ts` — New: `PresentOptions { json? }` and the `JSON_INDENT` constant.
- `$PROJECT/cli/bin/src/private/present/presentDocument.ts` — New: `presentDocument(document, options)` — indented JSON or the construct outline.
- `$PROJECT/cli/bin/src/private/present/presentContent.ts` — New: `presentContent(content, options)` — `{ content }` JSON or the content unchanged.
- `$PROJECT/cli/bin/src/private/present/private/makeDocumentOutline.ts` — New: recursive outline lines from a `{ construct, name?, children? }` node; `ArtDocument` is assignable to it, so no cast is needed at the call site.
- `$PROJECT/cli/bin/src/private/present/presentDocument.test.ts` — New: 4 tests; the fixture is a real parse of `'# Title\n\nSome prose.'` rather than a cast literal.
- `$PROJECT/cli/bin/src/private/present/presentContent.test.ts` — New: 3 tests over the JSON and human-readable branches.
- `$PROJECT/cli/bin/src/test/helpers/makeConfigMock.ts` — New: `makeConfigMock(overrides?)` — `loadBinConfig()` defaults spread under the overrides, mirroring the Art Work helper's shape.
- `$PROJECT/cli/bin/src/test/helpers/makeCodecContextMock.ts` — New: `makeCodecContextMock(overrides?)` — a real config over a real logger, mirroring `makeCommandContextMock`.
- `$PROJECT/cli/bin/src/test/helpers/makeTempDir.ts` — New: `makeTempDir(tempDirs)` registering the directory for the caller's `afterEach` cleanup, mirroring the Art Work helper.

### Commits

| Id                               | Repository / Checkout / Branch   | Policy   | Hash      | Status      |
| -------------------------------- | -------------------------------- | -------- | --------- | ----------- |
| `implement-codec-context-and-io` | Art MD / `$PROJECT` / `building` | `NOPUSH` | `3272dd0` | `COMMITTED` |

**Message:** `build(bin): add codec context, config, and file IO`

**Push:** Not pushed, per the `NOPUSH` policy. No `git push` was run; the commit is local to the `building` branch only.

The lefthook `pre-commit` hook (`0-clean`, `1-extract`, `2-ci`) ran on the commit and passed without `--no-verify`.

### Validation

| Command                             | Working directory            | Outcome                                                                                                                                                                                                                                            |
| ----------------------------------- | ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm ci`                            | `$WORKSPACE`                 | PASS — workspace dependencies installed.                                                                                                                                                                                                           |
| `npm ci`                            | `$PROJECT` (repository root) | PASS — dependencies reinstalled from `package-lock.json`.                                                                                                                                                                                          |
| `npm run test`                      | `$PROJECT/cli/bin`           | PASS — exit 0; 10 test files, 57 tests passed (27 new).                                                                                                                                                                                            |
| `npm run test:ci`                   | `$PROJECT/cli/bin`           | PASS — exit 0; 57 tests passed; statements 98.55% (136/138), lines 98.52% (134/136), functions 100% (52/52), branches 88.57% (62/70) — over the 90/90/90/75 thresholds. Every new module except the defensive "no version" throw is fully covered. |
| `npm run lint:fix`                  | `$PROJECT/cli/bin`           | PASS — prettier formatted the new files; eslint `--fix` clean.                                                                                                                                                                                     |
| `npm run lint`                      | `$PROJECT/cli/bin`           | PASS — prettier check clean, eslint clean, `tsc --noEmit` clean.                                                                                                                                                                                   |
| `npm run ci`                        | `$PROJECT` (repository root) | PASS — exit 0; 7/7 turbo tasks successful; the bin package lints, builds (esm + cjs), and clears the coverage thresholds.                                                                                                                          |
| `node dist/esm/…/loadBinConfig.mjs` | `$PROJECT/cli/bin`           | PASS — the built ESM bundle reports `version: 0.0.1`, matching `package.json`.                                                                                                                                                                     |
| CJS `__filename` fallback           | `$PROJECT/cli/bin`           | PASS — a standalone CJS bundle of `readPackageVersion` placed under `dist/esm/` resolves `version: 0.0.1`; outside the package it raises the documented "Cannot find" error.                                                                       |
| `git log --oneline -1`              | `$PROJECT`                   | PASS — `3272dd0 build(bin): add codec context, config, and file IO`, the exact prescribed message.                                                                                                                                                 |
| `git status`                        | `$PROJECT`                   | Clean — 23 files committed, nothing left uncommitted.                                                                                                                                                                                              |

Four type errors surfaced during verification and were fixed rather than worked around: `fs/promises.readFile` rejects a numeric file descriptor in its types, so stdin is read from `process.stdin` instead; `process.stdout.write`'s callback signature needed a `() => resolve()` wrapper; the presentation fixture used object literals with fields `ConstructBase` does not declare, so it now parses real markdown; and `makeConfigMock`'s nested-partial override type made the spread unassignable, so `PartialBinConfig` now takes full optional objects.

## Blockers (if any)

None.

## Feedback

### For the planner

- **Step 2 needs a module it does not list.** "Attach operations log over the logger" requires `OperationsLog`, but the plan's Scope enumerates no `src/private/log/` for this plan — `createOperationsLog.ts` was added here. Worth listing explicitly, the way the previous iteration's feedback asked for the `Operation` union to be listed.
- **`loadBinConfig` cannot read `package.json` by importing it.** The plan's Decisions state "Version from `package.json` — no `__BUILD_VERSION__` ambient global; `loadBinConfig` reads the version so `--version` works in dev and after build". `@noodlestan/esbuild` installs `esbuild-plugin-file-path-extensions`, whose resolver returns `{ external: true }` for any import whose extension is not JS-like, so `import … from '../../../package.json'` survives into the bundle and resolves against the output directory (`dist/package.json`, which does not exist). The walk-up in `readPackageVersion.ts` works around it at runtime. A build-side fix — making the plugin bundle JSON, or a `define` for the version — would let the loader stay a plain import and would help every package in the workspace.
- **Step 6's test list leaves the presentation helpers untested.** Coverage thresholds are enforced in `npm run ci`, so landing Step 4 without Step 6 coverage fails the pipeline. The plan assigns "the presentation helpers' JSON and human-readable branches" to the closing iteration; either name `presentDocument.test.ts`/`presentContent.test.ts` in Step 6, or state that intermediate iterations must add tests for everything they add.
- **`readInput`'s signature is widened.** Step 3 says `readInput` reads a file path, or `-`/absent for stdin. The implementation takes an optional second stream argument so the stdin branch is testable without replacing `process.stdin` or mocking `node:fs/promises`. Later iterations can call `ctx.io.readInput(options.file)` unchanged; if the seam is unwanted, the alternative is a global stub in the test.
- **`OperationsLog` is a subset of the Art Work one.** Only `log` and `all` are declared; `since` and `latest` are omitted because nothing in the codec CLI queries the log. If a later iteration needs them, they can be added without touching the call sites.

### For the technical writers

- No ambiguity blocked execution: every mandatory-reading file resolved, including the seven `:READ`-linked TypeScript convention pages, the commit-message conventions, and the three `$ART_WORK` references.
- "Human-readable form otherwise" is under-specified for a document: the instruction does not say what an `ArtDocument` should look like as text. The construct outline (`SectionBlock: Title` indented by depth) was chosen because it is the one rendering derivable from `ConstructBase` alone; if the CLI is meant to echo markdown for `parse`, say so in Step 4 and the outline becomes wrong.
- The plan's `Presentation` bullet does not say whether `presentDocument`/`presentContent` return a string or write to stdout. They return strings, because `--write` requires `doParse`/`doSerialize` to route the result through `ctx.io.writeOutput`. Worth stating — a stdout-writing `present*` would silently break `--write`.
- `$ART_WORK`'s `src/test/helpers/tempDirs/` bundles `makeTempDir` with `removeTempDirs` and `resilientRemoveDir`. Step 5 asks for `makeTempDir.ts` alone; the two I/O tests clean up with an inline `rm(…, { recursive: true, force: true })` in `afterEach`. If the resilience matters on CI, the two companion helpers should be named in Step 5.
- `cli/bin/_guide.md`'s Package Layout paragraph still says "`src/private/`, and `src/test/` are filled as that work arrives", and lists no `config/`, `context/`, `io/`, or `log/` directories. This iteration filled all four; the layout paragraph needs the same update the previous iteration's feedback already flagged.

### For the crew

- The bin's I/O is two functions over `node:fs/promises` and `node:process`; `readStdin` uses `node:stream/consumers` rather than reading file descriptor 0, which keeps the stdin path typed and injectable. The build's CJS half emits an `empty-import-meta` warning from the `__filename` fallback in `readPackageVersion` — it is expected, and `dist/cjs` is otherwise unaffected.
- Coverage for the whole package went from 100/87/100/100 to 98.55/88.57/100/98.52 across 57 tests: the two uncovered lines are the defensive "manifest has no version" throw in `readPackageVersion`.
- `createCodecContext` takes the `LoggerAPI` rather than creating it, matching Art Work's `createWorkspaceContext(config, store, log)` shape — the entry points create the logger and pass it, so `setOutputMode` can be called before the first command runs.
- `src/index.ts` is untouched, as Step 5 of the next iteration owns the public surface. Until it re-exports `loadBinConfig`, `dist/cjs/index.js` exports nothing at runtime, which is the same as before this iteration.
