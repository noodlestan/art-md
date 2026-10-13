# Sub-Agent REPORT (#producer)

**Plan:** `consolidate-codec-bin`

**Iteration Id:** `apply-cli-conventions`

**Outcome:** `COMPLETED`

## Evidence

### Changes

| Goal (from instruction)                                                                                                                                                    | Outcome                                                                                                                                                                                                                                                                                              |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Step 1 — Read the audit report at `$PROJECT/_backlog/3-now/plan-consolidate-codec-bin/plan__audit.md` and use it as the source of the deviations                           | Completed: all adoption tables consumed (25 rules with violations, ~215 sites), plus the 18 Decisions and the 4 Observations. Every decision marked _code change_ was applied; decisions marked _no code change / TS amendment_ were honoured without touching code.                                 |
| Step 2 — Refactor the audited deviations                                                                                                                                   | Completed: Filesystem, Explicit Code, Types, Flat Code, Literals and Unit Test deviation sites refactored across `$PROJECT/cli/bin/src/`; rules the audit found clean-by-construction were left untouched; no commands, options, output or exit codes changed.                                       |
| Step 3 — Collapse internal duplication (parallel `parse`/`serialize` factories, parallel `do{Operation}` bodies, shared option-parsing logic across the two command specs) | Completed: the two command factories delegate to one shared `createOperationCommand`; the two `do*` bodies delegate to one shared `runOperation`; option parsing (verbosity + write target + operation payload) and option declaration (the `[file]` / `--output` / `--write` trio) each exist once. |
| Step 4 — Verify behaviour is unchanged (`npm run test`, `npm run test:ci` from `$PROJECT/cli/bin/`)                                                                        | Completed: 121/121 tests pass (114 before + 7 new guard tests); coverage clears every threshold — lines 91.41%, statements 91.2%, functions 92.13%, branches 86.73% against 90/90/90/75.                                                                                                             |
| Step 5 — Commit `apply-cli-conventions` (policy NOPUSH)                                                                                                                    | Commit `7c5d15c7629012aa746471d232c4b3ccbf22de0f` — `refactor(bin): apply typescript conventions and collapse duplication`; 67 files changed (+529/−291) on branch `main` of `$PROJECT`; committed locally and **not pushed** (`main...origin/main [ahead 1]`).                                      |

#### Files changed

**Command wiring — `$PROJECT/cli/bin/src/private/bin/`**

- `commands/createOperationCommand.ts` (new) — the single shared command factory: console writer selection, logger construction, verbosity resolution, command context creation, generic `command` operation logging, `FAILURE_EXIT_CODE` on a `null` outcome.
- `commands/parse/createParseCommand.ts`, `commands/serialize/createSerializeCommand.ts` — reduced to one-line delegations (`'parse'` / `'serialize'` + the matching `do*`); the duplicated 13-line `action` arrows and both `return action as CommandHandler` casts are gone.
- `commands/types.ts` — `CommandHandler` given the precise handler signature (removes the type-assertion escape, Observation 3); added `CommandOperation`.
- `commands/private/resolveVerbosity.ts` (new) — extracts the verbosity decision so the `isValidVerbosity(...)` call no longer sits inside a ternary condition.
- `options/addCommandOptions.ts` (new) — the `addOutputOption` → `addFileArgument` → `addWriteOption` declaration trio previously repeated four times across the three program builders.
- `programs/parse/buildParseProgram.ts`, `programs/serialize/buildSerializeProgram.ts`, `programs/codec/buildCodecProgram.ts` — now declare their shared surface through `addCommandOptions`.

**Commands — `$PROJECT/cli/bin/src/private/commands/`**

- `private/runOperation.ts` (new) — the shared `do*` body: uri resolution, pending/success/failure logging, read → execute → write, `null` on failure.
- `types.ts` (new) — `RunOperationOptions`, `OperationRun`, `CreateOperation`, `ExecuteOperation`.
- `parse/doParse.ts`, `serialize/doSerialize.ts` — reduced to delegation; `ParseOptions`, `ParseOutcome`, `SerializeOptions`, `SerializeOutcome` are no longer exported (Decision 2).
- `parse/private/executeParse.ts`, `serialize/private/executeSerialize.ts` (new) — the per-operation codec step (`codec.parse` + JSON presentation vs `JSON.parse` + `codec.serialize`), including the extracted nested-object and nested-call sites flagged at the old `doParse:21` / `doSerialize:23`.
- `parse/private/createParseOperation.ts`, `serialize/private/createSerializeOperation.ts` — `new Date()` hoisted out of the returned literal (Decision 8).

**Logger — `$PROJECT/cli/bin/src/private/logger/`**

- `validateVerbosity.ts` → `isValidVerbosity.ts` (Decision 6, type-guard naming).
- `createConsoleWriter.ts` — returned arrow replaced by a named `writeMessage` function declaration (Decision 17).
- `createLogger.ts` — `buffer` → `bufferedMessages` (Plural Arrays); `shouldWrite` and `flush` extracted with state parameterisation.
- `private/shouldWrite.ts`, `private/flushMessages.ts` (new).
- `types.ts` — `LogLevel` declared before the `LogMessage` type that uses it (Order Types by Dependency).
- `createConsoleWriter.test.ts`, `isValidVerbosity.test.ts` (new) — guards for the two refactored, previously untested logger modules (audit Observation 2).

**Operations — `$PROJECT/cli/bin/src/private/operations/`**

- `private/formatData.ts`, `private/extractReason.ts`, `private/formatRawError.ts`, `private/getFailureLabel.ts` (new) — the private helpers removed from `createGenericOperation.ts` and `createOperationFailure.ts`; `FAILURE_LABELS` / `DEFAULT_FAILURE_LABEL` moved alongside `getFailureLabel` (Constants Location); the four-line `.split().map().filter()` chain unrolled into named intermediates.
- `createGenericOperation.ts`, `createOperationFailure.ts`, `createOperationSuccess.ts` — `new Date()` hoisted out of returned literals (Decision 8).
- `createOperationsLog.ts` — unused type re-export removed once `createOperationsLogMock` imports from `operations/types.ts` (Observation 4).

**IO, presentation, context**

- `io/private/writeOutput.ts` — private `terminate` helper inlined; `content.endsWith(...)` hoisted out of the ternary condition.
- `io/private/writeOutput.test.ts`, `io/private/writeStdout.test.ts` — share `test/helpers/io/spyOnStdoutWrite.ts` (new) instead of defining the helper twice; blank lines added between result capture and assertions (Block Spacing).
- `presentation/makeOperationLogLine.ts` — boolean variable `hasFinished` → `finished` (Boolean Naming).
- `context/createCommandContext.ts` — `import { type LoggerAPI }` → `import type { LoggerAPI }` (Observation 4).

**Test helpers — `$PROJECT/cli/bin/src/test/`**

- `helpers/makeTempDir.ts` → `helpers/tempDirs/makeTempDir.ts`; `helpers/tempDirs/{removeTempDirs,resilientRemoveDir,delay}.ts` ported from `$ART_WORK/cli/work/src/test/helpers/tempDirs/` and now used by every test that calls `makeTempDir` (Decision 15).
- `helpers/codec/createCommandContextMock.ts` → `helpers/context/createCommandContextMock.ts` (Decision 13); returned literal expanded.
- `helpers/codec/makeCodecMock.ts` → `helpers/codec/createCodecMock.ts` (Decision 11); returned literal expanded.
- `helpers/serialize/makeSerializeResultFixture.ts` — returned literal expanded (Expand Returned Object Literals + Expand Multi-Level Literals).
- All 13 fixtures and helpers now carry `/** @mocks ... */` or `/** @provides ... */` headers (Helper Header Comments).

**Tests**

- `logger/createLogger.test.ts` — inline mock `write` → `writeMock` (Function Mock Naming); the `{ level, args }` literals expanded (Expand Multi-Level Literals).
- `config/loadBinConfig.test.ts`, `context/createCommandContext.test.ts` — multi-level literals expanded, including the three-level `codec.parserConfig.constructs` literal.
- `bin/programs/codec/buildCodecProgram.test.ts` — array `declared` → `declaredCommands` (Plural Arrays).
- `presentation/presentDocument.test.ts` — description prefixed with `WHEN` (Test Description Prefixes).
- `io/private/readInput.test.ts`, plus the four integration tests (`test/codec.test.ts`, `test/parse.test.ts`, `test/serialize.test.ts`, `test/roundtrip.test.ts`) — `tempDirs` helper paths and `removeTempDirs` cleanup.
- Existing assertions were not changed anywhere: only names, literal shapes, helper paths and one test description differ.

**Package**

- `package.json` — added `"test:ci": "vitest run --coverage"`, the script every sibling package already declares; without it the instruction's verification command did not exist.

#### Ambiguity decisions

The audit's `## Decisions` section resolved its 7 ambiguities with the plan owner ("No ambiguity remains"); those _code change_ decisions (2, 6, 8, 9, 11, 13, 15, 17) were applied verbatim and the _no code change_ decisions (1, 3, 4, 5, 7, 10, 12, 14, 16, 18) were honoured. Four points the audit left to the executing worker were resolved as follows — each chosen to be most consistent with the TypeScript and Unit Test conventions and with `$ART_WORK/cli/work/src/private/`, none blocking:

1. **`createLogger` helpers** — the audit recorded `shouldWrite` and `flush` as File-as-Function violations while noting "extraction needs state parameterisation". Chosen: apply the recorded deviation — both extracted to `private/logger/private/` with explicit `mode` / `messages` / `write` parameters. The alternative (the Function Extraction rule exempts closure functions, and the `$ART_WORK` reference keeps `flush` as a closure) was rejected so the audit row is not left unapplied; behaviour is identical and both helpers are now independently testable.
2. **"shared option-parsing logic repeated across the two command specs"** — read both ways and applied both: (a) action-side parsing collapsed into `createOperationCommand` + `resolveVerbosity` (write-target → stream, `--output` → verbosity, operation payload built once); (b) declaration-side wiring collapsed into `addCommandOptions`, replacing the trio repeated in `buildParseProgram`, `buildSerializeProgram` and both subcommands of `buildCodecProgram`. Revertible independently if (b) was out of intent.
3. **`CommandHandler` signature** — replaced `(...args: unknown[]) => void | Promise<void>` with `(file: string | undefined, options: CommandOutputOptions) => Promise<void>` so the shared factory returns the handler without the `as CommandHandler` cast the audit listed under Observation 3. Commander's `.action()` still accepts it; `tsc --noEmit` and the suite confirm it.
4. **Missing `test:ci` script and red coverage gate** — `npm run test:ci` did not exist in `$PROJECT/cli/bin` (every other package has it), and coverage failed its own thresholds at baseline (measured before touching any file: lines 87.35%, statements 87.45%, functions 89.87% against 90/90/90). Chosen: add the conventional script, let the dedup/extraction do what it could (+0.4 points), and add unit tests for the two logger modules this iteration refactored (`createConsoleWriter`, `isValidVerbosity`) rather than lower a threshold or edit existing tests. Final coverage clears all four thresholds with margin.

Deliberately **not** collapsed, because the instruction names only three duplications: the parallel `buildParseProgram` / `buildSerializeProgram` bodies, the parallel `createParseOperation` / `createSerializeOperation` factories, and the three `bin/*.ts` entry scripts (audit Observation 1 / Decision 18). They remain candidates for the `identify-art-lib-extraction` inventory.

#### Validation evidence

- `$PROJECT` root — `npm run lint:fix` then `npm run lint`: passes (prettier, eslint, `tsc --noEmit`).
- `$PROJECT/cli/bin` — `npm run test`: **27 test files, 121 tests, all pass** (baseline 25 files / 114 tests; the +7 are the two new guard files).
- `$PROJECT/cli/bin` — `npm run test:ci`: **exit 0**. Coverage summary: statements 91.2% (249/273), branches 86.73% (85/98), functions 92.13% (82/89), lines 91.41% (245/268) — all above the configured thresholds (90/75/90/90). Baseline before the change: 87.45 / 77.45 / 89.87 / 87.35 (three of four failing).
- `$PROJECT/cli/bin` — `npm run build` then `npm run test:integration`: **5 files,29 tests pass** against freshly built `dist/` bundles, so the integration guard (help/version output, exit codes, verbosity modes, write targets, stdin, round trip) exercised the refactored code.
- Pre-commit hook — `npm run ci` (root): lefthook `0-clean`, `1-extract`, `2-ci` all green; turbo 7/7 tasks successful (lint + build + unit + integration across the monorepo).
- Not committed (outside this iteration's scope, left in the working tree): `$PROJECT/_backlog/_parking-lot.md`, `$PROJECT/_roadmap/6-plan/milestone-art-constructs/milestone.md`, `$PROJECT/_backlog/6-plan/plan-ergonomic-factories-api/` — concurrent edits by another session, deliberately excluded from the staged set (only `cli/bin/` was staged).

## Blockers (if any)

None.

## Feedback

### For the planner

- The verification block assumes `npm run test:ci` exists in `$PROJECT/cli/bin` and that coverage thresholds already clear; neither was true (script absent, gate red at baseline). Recommend future verification steps either name the fallback command or add "ensure the script exists" to Setting Up.
- The plan's commit table records branch `building` while this iteration ran on `main` per the delegator (main holds the full 79-file tree and the audit attachment). Worth aligning the plan before the next iteration is delegated.

### For the technical writers

- The audit's Filesystem table uses the label **File as Function**, which does not exist in `@noodlestan/conventions-typescript`; the actual rule is **Function Extraction**, and it explicitly exempts closure functions. That exemption conflicts with the two `createLogger` rows — one source should be corrected so the next audit does not have to re-decide.
- The audit states "No ambiguity remains", yet three rows still required a worker decision: the `createLogger` helpers, the wording "shared option-parsing logic repeated across the two command specs", and whether repairing the missing coverage script was in scope.
- Decision 16 (`{ mode: LogVerbosity }` may stay inline) is recorded as a pending convention amendment; the published conventions do not yet say so, so the rule as written still reads as a violation.

### For the crew

- The `cli/bin` `ci` script never ran coverage, so the 90% gate was unenforced. `test:ci` now exists — consider adding it to the package `ci` (or the turbo pipeline) so regressions are caught.
- Remaining parallel structure for the extraction inventory: `buildParseProgram` vs `buildSerializeProgram`, `createParseOperation` vs `createSerializeOperation`, and the load-config → build-program → parse sequence repeated in the three `bin/*.ts` entry scripts.
- `test/helpers/spawnCli.ts` still sits at the helpers root without a header comment; it falls outside the audited `src/` scope, so it was left alone.
