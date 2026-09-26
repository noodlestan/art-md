# Plan: Implement Bin Commands

**ID:** `implement-bin-commands`

**Status:** `READY`

**Template:** `.agents/domains/plans/templates/plan.tart`

**Skill:** `write-plan`

**Purpose:** Implement the `parse` and `serialize` operations and wire them into the `art-codec`, `art-parse`, and `art-serialize` entry points, sharing one set of commander builders, one set of operations, and one logger.

**Description:** Following the Art Work CLI layering — entry point → `run{CommandName}` → `do{OperationName}` → log operations → present outputs — this plan builds the codec CLI's operation log and logger, the codec context and file I/O it needs, the `doParse`/`doSerialize` operations with their `run{CommandName}` layer, the shared commander builder utilities, and finally the three entry points. The `codec` bin registers the same `parse` and `serialize` command specs the single-command bins use and reimplements nothing. Every iteration lands its own unit tests, and a closing iteration drives the package over its configured coverage thresholds with end-to-end CLI tests against the built bundles.

## Mandatory Reading

::READ `$DOMAINS/plans/structures/plan.art` (Structure) — Describe the work-item changes through a series of iterations and commits with detailed instructions.

---

## Path Variables

This section lists the path variables used throughout the Plan file and its downstream work items. All file references in the Plan and downstream work items MUST use these variables — never bare filesystem paths.

| Variable     | Resolved Path                 | Purpose                                                     |
| ------------ | ----------------------------- | ----------------------------------------------------------- |
| `$WORKSPACE` | Current working directory     | Workspace root directory.                                   |
| `$PROJECT`   | `checkouts/art-md-planning`   | Planning checkout for Art MD.                               |
| `$BUILD`     | `checkouts/art-md-building`   | Building checkout for Art MD (implementation).              |
| `$ART_WORK`  | `checkouts/art-work-building` | Art Work checkout (reference CLI implementation to follow). |

## Summary

Implement the codec CLI's operation log and logger, codec context and file I/O, the `doParse` and `doSerialize` operations, the shared commander builder utilities, and the three `art-codec`/`art-parse`/`art-serialize` entry points, with unit and integration tests throughout and coverage driven over the package's configured thresholds.

## Context

This section describes the upstream sources, guides, knowledge, required skills, and mandatory reading that define and support the Plan.

### Upstream Work

| Kind         | Path                                                               | Role                                                  |
| ------------ | ------------------------------------------------------------------ | ----------------------------------------------------- |
| Milestone    | `$PROJECT/_roadmap/3-now/milestone-codec-bin/milestone.md`         | Coordinates this plan within the Codec Bin milestone. |
| Design       | `$PROJECT/_roadmap/3-now/milestone-codec-bin/milestone__design.md` | The design this plan implements.                      |
| Plan         | `$PROJECT/_backlog/6-plan/plan-scaffold-bin-package/plan.md`       | Establishes the manifest contract and entry points.   |
| Milestone    | `$PROJECT/_roadmap/1-done/milestone-art-codec/milestone.md`        | Delivered `@art-md/codec` and `createArtCodec()`.     |
| Architecture | `$PROJECT/architecture/codec.md`                                   | The codec and source contracts this CLI consumes.     |

### Required Skills

This section lists the skills required to prepare, execute, or verify this Plan.

- `write-plan` — Writes execution plans and implementation instructions. Required for Planning Work Item.
- `render-template` — Renders plan and instruction artefacts. Required for Drafting, Refining.

### Domains

This section lists all domains involved in the Plan.

| Domain / Path                                 | Description                                                                  |
| --------------------------------------------- | ---------------------------------------------------------------------------- |
| Domain: Plans `$DOMAINS/plans/index.md`       | Planning lifecycle for contextualising, drafting, planning, and integrating. |
| Domain: Packages `$DOMAINS/packages/index.md` | Represents publishable libraries and CLIs, their grouping and publications.  |

### Knowledge

This section describes the context knowledge required for the different phases of work so that it can be included in downstream artefacts.

::READ `$WORKSPACE/_guide.md` (Guide) — Defines workspace operations and verification. Relevant for Setting Up, Verifying Completion.
::READ `$PROJECT/_guide.md` (Guide) — Defines project operations and verification. Relevant for Setting Up, Verifying Completion.
::READ `$PROJECT/node_modules/@noodlestan/conventions-typescript/art/index.md` (Conventions) — Conventions for working with TypeScript. Relevant for Setting Up, Verifying Step.
::READ `$WORKSPACE/knowledge/conventions/writing-commit-message.art` (Conventions) — Defines commit message conventions. Relevant for Writing Commit Message.
::READ `$ART_WORK/cli/work/src/index.ts` (Reference) — Art Work CLI entry point pattern. Relevant for Implementing.
::READ `$ART_WORK/cli/work/src/commands/clone/runClone.ts` (Reference) — Art Work `run{CommandName}` pattern. Relevant for Implementing.
::READ `$ART_WORK/cli/work/src/private/commands/doClone.ts` (Reference) — Art Work `do{OperationName}` pattern. Relevant for Implementing.
::READ `$ART_WORK/cli/work/src/private/operations/types.ts` (Reference) — Art Work operation types. Relevant for Implementing.
::READ `$ART_WORK/cli/work/src/private/logger/createLogger.ts` (Reference) — Art Work logger pattern. Relevant for Implementing.
::READ `$ART_WORK/cli/work/src/private/present/makeOperationLogLine.ts` (Reference) — Art Work operation log line presentation. Relevant for Implementing.
::READ `$ART_WORK/cli/work/src/test/helpers/context/makeConfigMock.ts` (Reference) — Art Work config mock helper. Relevant for Implementing.
::READ `$ART_WORK/cli/work/src/test/helpers/context/makeCommandContextMock.ts` (Reference) — Art Work command context mock helper. Relevant for Implementing.

## Scope

This section describes the working scope coordinated by the Plan.

Implement the command layer in `$BUILD/cli/bin/src/`, in the order entry point → `run{CommandName}` → `do{OperationName}` → log operations → present outputs. The package contract, the three stub entry points, and the lint config are established by Plan: Scaffold Bin Package.

### (Scope) Package: Bin

**Record:** `$BUILD/cli/bin/_records/package.art`

**Role:** Owns the three CLI entry points and the shared commander builder utilities and `doParse`/`doSerialize` implementations.

**Partial:**

- `owner` — Project: Art MD
- `path` — `$BUILD/cli/bin/`
- `canonicalName` — `@art-md/bin`

**Changes:**

- `src/private/operations/` — the operation model and factories:
  - `types.ts` — `OperationOutcome` (`pending` | `success` | `failure`), `OperationBase { operation, ts, finishedTs?, outcome, message(), timing() }`, `OperationPending`, `OperationSuccess`, `OperationFailure` (adds `error` and `errorSerialized()`), and the per-operation pending types `ParsePending` (`uri`) and `SerializePending` (`uri`).
  - `createGenericOperation.ts` — `createGenericOperation(operation, data?)` for the boot and command log lines.
  - `createParseOperation.ts` / `createSerializeOperation.ts` — the per-operation pending factories, mirroring `createCloneOperation`.
  - `createOperationSuccess.ts` — `createOperationSuccess(pending, message?)` stamping `finishedTs`.
  - `createOperationFailure.ts` — `createOperationFailure(pending, error)` deriving the failure label and serialised error; label map covers `parse` and `serialize`.
- `src/private/present/makeOperationLogLine.ts` — `makeOperationLogLine(op, { standalone })` rendering outcome glyph, operation, message, and timing. No checkout columns: the codec CLI has no checkout concept, so the Art Work repo/checkout columns are dropped rather than faked.
- `src/private/logger/createLogger.ts` — `LoggerAPI { log(op), setOutputMode(mode) }` buffering pending operations until the output mode is set; `quiet` discards the buffer, `verbose` flushes it.
- `src/private/config/` — `types.ts` (`BinConfig` with `output.mode`, `codec` overrides) and `loadBinConfig.ts` reading the version and defaults from `package.json`, with optional user overrides; the bin does not own a config file format.
- `src/private/context/createCodecContext.ts` — `CodecContext { config, codec, log, io }` composing the `ArtCodec` from `createArtCodec(config.codec)`, an operations log over the logger, and the I/O helpers.
- `src/private/io/` — `readInput.ts` (read a file path, or `-`/absent for stdin) and `writeOutput.ts` (write to stdout, or to a `--write` target file), using `node:fs/promises` and `node:process` directly.
- `src/private/present/presentDocument.ts` / `presentContent.ts` — render the `ArtDocument` and serialised content, choosing JSON via a `--json` option and the human-readable form otherwise.
- `src/private/commands/doParse.ts` — `doParse(ctx, options): Promise<ParseResult | null>` — create a pending parse operation, log it, call `ctx.codec.parse(...)`, log a success, present the document, and on error log a failure and return `null`.
- `src/private/commands/doSerialize.ts` — `doSerialize(ctx, options): Promise<SerializeResult | null>` — the mirror for `ctx.codec.serialize(...)`, presenting the serialised content.
- `src/commands/parse/runParse.ts` — `runParse(ctx, options)` logging the generic `command` operation and dispatching to `doParse`.
- `src/commands/serialize/runSerialize.ts` — `runSerialize(ctx, options)` logging the generic `command` operation and dispatching to `doSerialize`.
- `src/private/commander/buildParseCommand.ts` — `buildParseCommand(): Command` — one command spec carrying the name, description, arguments (`[file]`, `-` for stdin), options (`-o, --output <mode>`, `--json`, `-w, --write <file>`), and the action that builds the context and calls `runParse`.
- `src/private/commander/buildSerializeCommand.ts` — `buildSerializeCommand(): Command` — the same shape for serialise (`[file]`, `-o`, `-w, --write <file>`).
- `src/private/commander/buildProgram.ts` — `buildProgram({ name, description, commands })` applying `name`, `description`, and the package version, then registering the given commands; shared by all three bins.
- `src/bin/parse.ts` — `buildProgram` with a single `buildParseCommand()`; `src/bin/serialize.ts` — a single `buildSerializeCommand()`; `src/bin/codec.ts` — `buildProgram` with `buildParseCommand()` and `buildSerializeCommand()`. The codec bin calls the same builders and defines no command logic of its own.
- `src/index.ts` — export the operation types, the command specs, the builders, and `doParse`/`doSerialize` so the bin is composable from TypeScript as well as from the shell.
- `src/test/helpers/` — `makeConfigMock.ts` and `makeCodecContextMock.ts` equivalents of the Art Work helpers, plus a `makeTempDir.ts` for I/O tests.
- Tests: `src/private/operations/*.test.ts`, `src/private/logger/createLogger.test.ts`, `src/private/present/makeOperationLogLine.test.ts`, `src/private/config/loadBinConfig.test.ts`, `src/private/context/createCodecContext.test.ts`, `src/private/io/*.test.ts`, `src/private/commands/doParse.test.ts`, `doSerialize.test.ts`, `src/commands/parse/runParse.test.ts`, `serialize/runSerialize.test.ts`, and `src/private/commander/*.test.ts` — covering the success and failure paths of both operations, the logger's buffering and mode behaviour, the command registration of all three programs, and the roundtrip through the real codec.
- `src/bin/cliIntegration.test.ts` — spawn the built `dist/esm/bin/{parse,serialize}.mjs` against a fixture file, asserting stdout, `--write`, and the non-zero exit on a parse failure; the end-to-end guard that the `bin` manifest entries actually run.

**Dependencies:**

- Package: Codec — `@art-md/codec` must exist first (delivered by Milestone: Art Codec).
- Plan: Scaffold Bin Package — the manifest contract, entry point paths, and lint config must be established first.

## Execution Context

Execution occurs from `$WORKSPACE/`; the package work is performed in the Art MD building checkout `$BUILD` (checkout `checkouts/art-md-building`) on branch `building`, under `$BUILD/cli/bin/`. The reference CLI implementation lives in `$ART_WORK` (`checkouts/art-work-building/cli/work`).

---

## Items:

This section lists the downstream work items produced, coordinated, or advanced by the plan, identifying blocking dependencies across resources of different owners.

| Iteration / Instructions                                                                                               | Status  |
| ---------------------------------------------------------------------------------------------------------------------- | ------- |
| Iteration: Implement Operation Log `./instructions/implement-operation-log.md`                                         | `READY` |
| Iteration: Implement Codec Context and IO `./instructions/implement-codec-context-and-io.md`                           | `READY` |
| Iteration: Implement Parse Command `./instructions/implement-parse-command.md`                                         | `READY` |
| Iteration: Implement Serialize Command `./instructions/implement-serialize-command.md`                                 | `READY` |
| Iteration: Implement Command Builders and Entry Points `./instructions/implement-command-builders-and-entry-points.md` | `READY` |
| Iteration: Verify Bin Coverage `./instructions/verify-bin-coverage.md`                                                 | `READY` |

### Iteration: Implement Operation Log

**Id:** `implement-operation-log`

**Status:** `READY`

**Purpose:** Give the CLI the operation vocabulary and the logger the commands report through, so every later iteration has a way to record progress.

**Description:** Port the Art Work operation model to the codec CLI's two operations, drop the checkout-specific presentation, and implement the buffering logger.

**Instructions:** `./instructions/implement-operation-log.md`

**Changes:**

- Add `src/private/operations/types.ts` — `OperationOutcome`, `OperationBase`, `OperationPending`, `OperationSuccess`, `OperationFailure`, `ParsePending`, `SerializePending`.
- Add `src/private/operations/createGenericOperation.ts`, `createParseOperation.ts`, `createSerializeOperation.ts`, `createOperationSuccess.ts`, `createOperationFailure.ts`.
- Add `src/private/present/makeOperationLogLine.ts` — outcome glyph, operation, message, timing; no checkout columns.
- Add `src/private/logger/createLogger.ts` — buffer pending operations until `setOutputMode`; `quiet` discards, `verbose` flushes.
- Add `src/private/operations/operations.test.ts` and `src/private/logger/createLogger.test.ts` — success/failure stamping, timing, error labels and serialisation, buffer-then-flush and buffer-then-discard.

**Dependencies:**

- None.

#### Commits:

| ID                        | Repository / Checkout / Branch | Policy   | Hash  | Status     |
| ------------------------- | ------------------------------ | -------- | ----- | ---------- |
| `implement-operation-log` | Art MD / `$BUILD` / `building` | `NOPUSH` | (TBD) | `AUTHORED` |

##### Commit: `implement-operation-log`

**Repository:** Art MD

**Message:**

```text
build(bin): add operation log types and logger
```

### Iteration: Implement Codec Context and IO

**Id:** `implement-codec-context-and-io`

**Status:** `READY`

**Purpose:** Give the operations a context to run in — a configured codec, a config, and file/stdin I/O.

**Description:** Implement the bin's config loading, the `CodecContext` that composes the `ArtCodec` from `createArtCodec()`, the thin file I/O helpers, and the mock test helpers the later iterations use.

**Instructions:** `./instructions/implement-codec-context-and-io.md`

**Changes:**

- Add `src/private/config/types.ts` and `src/private/config/loadBinConfig.ts` — `BinConfig` (`output.mode`, `codec` overrides) and defaults read from `package.json`, including the version reported by `--version`.
- Add `src/private/context/createCodecContext.ts` — `CodecContext { config, codec, log, io }` composing `createArtCodec(config.codec)`, an operations log over the logger, and the I/O helpers.
- Add `src/private/io/readInput.ts` and `src/private/io/writeOutput.ts` — file path or `-`/absent for stdin; stdout or a `--write` target file.
- Add `src/private/present/presentDocument.ts` and `presentContent.ts` — JSON via `--json`, human-readable otherwise.
- Add `src/test/helpers/makeConfigMock.ts`, `src/test/helpers/makeCodecContextMock.ts`, and `src/test/helpers/makeTempDir.ts`.
- Add `loadBinConfig.test.ts`, `createCodecContext.test.ts`, and `readInput`/`writeOutput` tests using the temp-dir helper.

**Dependencies:**

- None.

#### Commits:

| ID                               | Repository / Checkout / Branch | Policy   | Hash  | Status     |
| -------------------------------- | ------------------------------ | -------- | ----- | ---------- |
| `implement-codec-context-and-io` | Art MD / `$BUILD` / `building` | `NOPUSH` | (TBD) | `AUTHORED` |

##### Commit: `implement-codec-context-and-io`

**Repository:** Art MD

**Message:**

```text
build(bin): add codec context, config, and file IO
```

### Iteration: Implement Parse Command

**Id:** `implement-parse-command`

**Status:** `READY`

**Purpose:** Implement the `parse` operation end to end, from the `run{CommandName}` layer down to `codec.parse()`.

**Description:** Add `doParse` and `runParse` with pending/success/failure logging and document presentation, plus the unit tests covering both outcomes.

**Instructions:** `./instructions/implement-parse-command.md`

**Changes:**

- Add `src/private/commands/doParse.ts` — create and log the pending parse operation, call `ctx.codec.parse(...)`, log the success, present the document, and on error log a failure and return `null`.
- Add `src/commands/parse/runParse.ts` — log the generic `command` operation, then dispatch to `doParse`.
- Add `src/test/helpers/makeParseFixture.ts` — a small Art MD fixture string for the parse tests.
- Add `src/private/commands/doParse.test.ts` and `src/commands/parse/runParse.test.ts` — success presents a document, failure logs and returns `null`, the generic command operation is logged with the options.

**Dependencies:**

- None.

#### Commits:

| ID                        | Repository / Checkout / Branch | Policy   | Hash  | Status     |
| ------------------------- | ------------------------------ | -------- | ----- | ---------- |
| `implement-parse-command` | Art MD / `$BUILD` / `building` | `NOPUSH` | (TBD) | `AUTHORED` |

##### Commit: `implement-parse-command`

**Repository:** Art MD

**Message:**

```text
build(bin): implement doParse operation and runParse
```

### Iteration: Implement Serialize Command

**Id:** `implement-serialize-command`

**Status:** `READY`

**Purpose:** Implement the `serialize` operation end to end, mirroring `parse` so the two share every layer but the codec call.

**Description:** Add `doSerialize` and `runSerialize` with the same logging and presentation shape as `parse`, plus the unit tests covering both outcomes and the document roundtrip.

**Instructions:** `./instructions/implement-serialize-command.md`

**Changes:**

- Add `src/private/commands/doSerialize.ts` — create and log the pending serialise operation, call `ctx.codec.serialize(...)`, log the success, present the content, and on error log a failure and return `null`.
- Add `src/commands/serialize/runSerialize.ts` — log the generic `command` operation, then dispatch to `doSerialize`.
- Add `src/private/commands/doSerialize.test.ts` and `src/commands/serialize/runSerialize.test.ts` — success presents serialised content, failure logs and returns `null`, and a `doSerialize` after `doParse` roundtrips the fixture back to the same markdown.

**Dependencies:**

- None.

#### Commits:

| ID                            | Repository / Checkout / Branch | Policy   | Hash  | Status     |
| ----------------------------- | ------------------------------ | -------- | ----- | ---------- |
| `implement-serialize-command` | Art MD / `$BUILD` / `building` | `NOPUSH` | (TBD) | `AUTHORED` |

##### Commit: `implement-serialize-command`

**Repository:** Art MD

**Message:**

```text
build(bin): implement doSerialize operation and runSerialize
```

### Iteration: Implement Command Builders and Entry Points

**Id:** `implement-command-builders-and-entry-points`

**Status:** `READY`

**Purpose:** Replace the three stubs with real entry points that share one program builder and one set of command specs.

**Description:** Implement `buildProgram`, `buildParseCommand`, and `buildSerializeCommand`, then wire `src/bin/{codec,parse,serialize}.ts` to them and export the public surface — proving the codec bin registers the same specs the single-command bins use and reimplements nothing.

**Instructions:** `./instructions/implement-command-builders-and-entry-points.md`

**Changes:**

- Add `src/private/commander/buildProgram.ts` — apply name, description, and package version, then register the supplied command specs.
- Add `src/private/commander/buildParseCommand.ts` and `buildSerializeCommand.ts` — the command specs with arguments, options, and actions that build the context and call the `run{CommandName}` layer.
- Replace the three stubs with real entry points: `src/bin/parse.ts` registers `buildParseCommand()`; `src/bin/serialize.ts` registers `buildSerializeCommand()`; `src/bin/codec.ts` registers both and defines no command logic.
- Update `src/index.ts` — export the operation types, command specs, builders, and `doParse`/`doSerialize`.
- Add `src/private/commander/buildProgram.test.ts` and `buildParseCommand.test.ts`/`buildSerializeCommand.test.ts` — each program reports the right name and version; `art-codec` exposes `parse` and `serialize` while `art-parse` and `art-serialize` expose exactly one; the codec's `parse` spec is the same object the single-command bin uses.

**Dependencies:**

- None.

#### Commits:

| ID                                            | Repository / Checkout / Branch | Policy   | Hash  | Status     |
| --------------------------------------------- | ------------------------------ | -------- | ----- | ---------- |
| `implement-command-builders-and-entry-points` | Art MD / `$BUILD` / `building` | `NOPUSH` | (TBD) | `AUTHORED` |

##### Commit: `implement-command-builders-and-entry-points`

**Repository:** Art MD

**Message:**

```text
build(bin): add shared command builders and three entry points
```

### Iteration: Verify Bin Coverage

**Id:** `verify-bin-coverage`

**Status:** `READY`

**Purpose:** Prove the CLI works as an installed binary and that the package meets its configured coverage thresholds.

**Description:** Add end-to-end tests that spawn the built bundles for all three bin names, then close the remaining coverage gaps — output modes, the `--write` and stdin paths, and the error branches — until `npm run test:ci` clears the thresholds in `vitest.config.ts`.

**Instructions:** `./instructions/verify-bin-coverage.md`

**Changes:**

- Extend `src/bin/cliIntegration.test.ts` — spawn `dist/esm/bin/parse.mjs` and `dist/esm/bin/serialize.mjs` against a fixture file, and `dist/esm/bin/codec.mjs` with each subcommand; assert `--version`, `--help`, stdout, `--json`, `--write`, stdin via `-`, and a non-zero exit with a failure log line on a parse error.
- Add tests for the `quiet` and `verbose` output modes and the presentation helpers' JSON and human-readable branches.
- Run `npm run test:ci` from `$BUILD/cli/bin/` and close any remaining gap until lines, functions, and statements reach 90% and branches reach 75%.
- Run `npm run ci` from the repository root to confirm the whole pipeline passes with the new tests included.

**Dependencies:**

- None.

#### Commits:

| ID                    | Repository / Checkout / Branch | Policy   | Hash  | Status     |
| --------------------- | ------------------------------ | -------- | ----- | ---------- |
| `verify-bin-coverage` | Art MD / `$BUILD` / `building` | `NOPUSH` | (TBD) | `AUTHORED` |

##### Commit: `verify-bin-coverage`

**Repository:** Art MD

**Message:**

```text
test(bin): add cli integration tests and meet coverage thresholds
```

## Work

### Next

This section states the immediate action needed to advance the Plan.

Delegate Iteration: Implement Operation Log.

### Blockers

This section lists the impediments to progress and the work items they involve.

- None.

---

## Operating Instructions

### Setting Up

**Purpose:** Prepare the execution environment.

**Instructions:** (From `$WORKSPACE/_guide.md`)

Run from the `$WORKSPACE` root:

```bash
npm ci # to install workspace dependencies.
```

**Instructions:** (From `$PROJECT/_guide.md`)

Run from the repository root (monorepo):

```bash
npm ci # to install dependencies.
```

### Verifying Completion

**Purpose:** Confirms that the work item has been completed and satisfies its intended outcome.

**Instructions:** (From `$PROJECT/_guide.md`)

Runs automatically on pre-commit hook (from the repository root):

```bash
npm run ci # lint, test and build
```

### Verifying Step

**Purpose:** Confirms that a step is correct before continuing.

**Instructions:** (From `$PROJECT/_guide.md`)

When making changes to the CLI package, execute from `$BUILD/cli/bin/`:

```bash
npm run test # runs vitest against the CLI unit tests
```

**Instructions:** (From `$PROJECT/_guide.md`)

Before the coverage iteration, build the bundles the integration tests spawn:

```bash
npm run build # emits dist/esm/bin/{codec,parse,serialize}.mjs
```

---

## Coordination

This section describes the boundaries, evidence, and follow ups of this work item.

### Not In Scope

- **`@art-lib` extraction** — shared CLI plumbing is identified, not extracted; that is Plan: Consolidate Codec Bin.
- **Validator command** — `@art-md/validator` remains `PLANNED`; no `validate` command is registered.
- **Concrete content sources** — `FSContentSource` and `MemoryContentSource` remain future work; the bin owns its own thin file I/O.
- **Config file format** — the bin reads defaults from `package.json` and takes options from the command line; it does not own a config file.

### Evidence

- None yet.

### Findings

- **The CLI has no checkout concept** — the Art Work operation log lines carry repo and checkout columns; the codec CLI has neither, so `makeOperationLogLine` drops those columns rather than emitting placeholders.
- **The bin build already supports multiple entry points** — `esbuild-cli` globs `src/**/*.ts`, so the three bins build as three independent bundles with no build-config change.
- **Coverage is enforced, not advisory** — `vitest.config.ts` already sets 90/90/90/75 thresholds, so the closing iteration closes gaps rather than raising a target.
- **Integration tests need a build first** — the CLI tests spawn `dist/esm/bin/*.mjs`, so the build must run before `npm run test:ci`; this is stated in the plan's Verifying Step instructions.

### Decisions

- **Three layers, one implementation each** — `run{CommandName}` in `src/commands/` and `do{OperationName}` in `src/private/commands/` mirror Art Work, so the two operations have the same shape and the two bins share them.
- **The codec bin registers specs, it does not build them** — `src/bin/codec.ts` passes `buildParseCommand()` and `buildSerializeCommand()` to `buildProgram()`; the single-command bins pass the same functions, so the codec bin contains no command logic.
- **Version from `package.json`** — no `__BUILD_VERSION__` ambient global; `loadBinConfig` reads the version so `--version` works in dev and after build.
- **The bin owns its I/O** — `readInput`/`writeOutput` use `node:fs/promises` directly; the codec stays I/O-free and `FSContentSource` stays future work.
- **Checklist of tests per operation** — each operation iteration covers the success path, the failure path, and the returned `null`; the coverage iteration owns the branch-level gaps.

### Knowledge to Update

- `$BUILD/cli/bin/_records/package.art` — the entry points and the command surface.
- `$BUILD/cli/bin/_guide.md` — the `src/` layout and the operating instructions for the new commands.
- `$BUILD/cli/bin/README.md` — the command reference.

### Follow Ups

- **Repeated CLI plumbing** — the operation log, logger, program builder, and context factory duplicate the Art Work CLI; Plan: Consolidate Codec Bin identifies the exact extraction units for `@art-lib`.

### Feedback

- None.
