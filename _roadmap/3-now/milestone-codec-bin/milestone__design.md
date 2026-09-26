# Design: Codec Bin CLI

**Attachment to:** Milestone: Codec Bin (`./milestone.md`)

**Status:** `DRAFT`

**Purpose:** Capture the design for the Art MD CLI binaries (`art-codec`, `art-parse`, `art-serialize`), lifting the patterns from the Art Work CLI (`$ART_WORK/cli/work`) and applying them to the codec CLI.

## Lock Down

Locked down by the user during milestone drafting. The design lifts the Art Work CLI patterns and applies them to the codec CLI. Details to be confirmed with the user: bin contracts, package record, purpose, description, canonical name, and paths.

**Validation:**

- The Art Work CLI patterns (entry point → `run{CommandName}` → `do{OperationName}` → log operations → present outputs) are captured from `$ART_WORK/cli/work`.
- The `@art-md/codec` package (`createArtCodec()`) is delivered and available as the underlying implementation.

**Refinements:**

- None yet — pending user confirmation of bin contracts and package identity.

## Art Work CLI Patterns (Reference)

The reference implementation lives in `$ART_WORK/cli/work` (`checkouts/art-work-building/cli/work`). It uses the `commander` NPM dependency and establishes the following patterns:

### Entry Point (`src/index.ts`)

- `#!/usr/bin/env node` shebang.
- `new Command()` from `commander`.
- `program.name('art-workspace').description(...).version(__BUILD_VERSION__)`.
- Each command is registered with `.command('<name>').description(...).option(...).argument(...).action(async (args, options) => {...})`.
- The action builds the context (`loadWorkspaceConfig`, `createCheckoutStore`, `createOperationsLog`, `createWorkspaceContext`), sets the output mode, and dispatches to `run{CommandName}(ctx, options)`.
- `program.parse()` at the end.

### Command Layer (`run{CommandName}`)

- `runClone(ctx: WorkspaceContext, options: CloneOptions): Promise<WorkspaceContext>`.
- Loads records, hydrates the store, logs a generic command operation (`createGenericOperation('command', ['clone', options])`), then dispatches to helpers (`cloneAll`/`cloneSpecific`/`cloneStatus`).

### Do Layer (`do{OperationName}`)

- `doClone(ctx, checkout): Promise<Checkout | null>`.
- Creates a pending operation (`createCloneOperation(checkout)`), logs it, performs the work, logs a success operation (`createOperationSuccess(createCloneOperation(rescan))`), and on error logs a failure operation (`createOperationFailure(pending, error)`) and returns `null`.

### Operation Types (`private/operations/types.ts`)

- `OperationOutcome = 'pending' | 'success' | 'failure'`.
- `OperationBase { operation, ts, finishedTs?, checkout?, outcome, message(), timing() }`.
- `OperationPending` / `OperationSuccess` / `OperationFailure` (failure adds `error` and `errorSerialized()`).
- Per-operation pending interfaces (e.g. `ClonePending` with `location`).
- `createGenericOperation(operation, data?)` for generic ops.

### Logger (`private/logger/createLogger.ts`)

- `LoggerAPI { log(op), setOutputMode(mode) }`.
- Buffers pending ops until the output mode is set; `quiet` discards pending ops, `verbose` flushes them.
- Logs via `makeOperationLogLine(op, { standalone: true }).join(' | ')`.

### Test Helpers (`src/test/helpers/context/`)

- `makeConfigMock(rootPath, overrides?)` — returns a `WorkspaceConfig` with `clone`, `root`, `checkouts`, `records`, `output` fields.
- `makeCommandContextMock(tempDir, workspace?)` — builds a `WorkspaceContext` from the config mock, a checkout store, and an operations log.

## Codec Bin Design

### Target Package

- **Location:** `$BUILD/cli/bin/` (canonical name to be confirmed, likely `@art-md/bin`).
- **Purpose:** Expose parsing and serialising as consistent, composable command-line tools.
- **Description:** CLI that exposes the codec operations (`parse`/`serialize`) as three entry points.

### Bin Exports (`package.json`)

```json
{
  "bin": {
    "art-codec": "bin/codec",
    "art-parse": "bin/parse",
    "art-serialize": "bin/serialize"
  }
}
```

### Entry Points

- `bin/codec` — registers `parse` and `serialize` commands; reuses the shared commander builder utilities and the shared `doParse`/`doSerialize` implementations; reimplements nothing.
- `bin/parse` — the `parse` command.
- `bin/serialize` — the `serialize` command.

### Shared Commander Builder Utilities

A shared module builds the `Command` for each entry point, so all three bins share the same commander setup (name, description, version, options, arguments).

### Shared Operations

- `doParse` — wraps `codec.parse(...)` (or `parse(...)`), logging pending/success/failure operations and presenting the output.
- `doSerialize` — wraps `codec.serialize(...)` (or `serialize(...)`), logging pending/success/failure operations and presenting the output.

### Operation Logging

Follow the Art Work logger pattern: create a logger, buffer pending ops until the output mode is set, log pending/success/failure operations, and present outputs.

### Unit Tests, Mocks, and Test Helpers

Follow the Art Work test helper patterns: `makeConfigMock` and `makeCommandContextMock` equivalents for the codec CLI.

## Relationships

```
bin/codec ── parse ──→ doParse ──→ codec.parse(...)
    │
    └────── serialize ──→ doSerialize ──→ codec.serialize(...)

bin/parse ──→ doParse ──→ codec.parse(...)
bin/serialize ──→ doSerialize ──→ codec.serialize(...)

All three share:
  - commander builder utilities
  - doParse / doSerialize implementations
```

## Layering

```
bin/codec, bin/parse, bin/serialize
        │
        │ use
        ↓
  commander builder utils
        │
        │ use
        ↓
  doParse / doSerialize
        │
        │ use
        ↓
  @art-md/codec (createArtCodec)
```

## Consolidation Follow-Up (`@art-lib`)

Phase 3 identifies follow-ups for abstracting repeated code between the codec and artwork bins into `@art-lib` — a package of Shared libraries and tools for building CLIs and Tools; purpose: build high quality, consistent CLI and Tool experiences from composable units.

## Open Questions

- Canonical package name (likely `@art-md/bin`).
- Exact `bin` export names (`art-codec`, `art-parse`, `art-serialize`).
- Package record path.
- Purpose and description wording.
- Paths for the entry points and shared modules.
