# Comparison: Codec Bin vs Art Work CLI

**From:** Art MD Project (`checkouts/art-md-planning`)
**To:** Art Lib Project (`checkouts/art-lib-planning`)
**Date:** 2026-09-26
**Purpose:** Side-by-side comparison of the `@art-md/bin` CLI (codec bin, planned) against the `@art-work/cli` CLI (Art Work, implemented) to identify deviations and propose `@art-lib` abstractions.

---

## Shared Architecture Pattern

Both CLIs follow the same layered architecture, lifted from Art Work:

```
Entry Point (src/index.ts or src/bin/*.ts)
    │
    │ registers
    ↓
Command Spec (build{Command}Command)
    │
    │ action → builds context → dispatches
    ↓
run{CommandName}(ctx, options)
    │
    │ logs generic command op → dispatches
    ↓
do{OperationName}(ctx, target)
    │
    │ creates pending op → logs → performs work
    │ → logs success/failure → returns result|null
    ↓
Present Output (makeOperationLogLine, reports, or direct output)
```

The pattern is identical. The deviations are in what each layer owns, how generic the utilities are, and what stays project-specific.

---

## 1. What Is Identical (Strong Extraction Candidates for `@art-lib`)

### 1.1 Operation Model

| Aspect                   | Art Work (`$ART_WORK/cli/work/src/private/operations/`)        | Codec Bin (planned in `$BUILD/cli/bin/src/private/operations/`) | Deviation                     |
| ------------------------ | -------------------------------------------------------------- | --------------------------------------------------------------- | ----------------------------- |
| `OperationOutcome`       | `'pending' \| 'success' \| 'failure'`                          | Same                                                            | None                          |
| `OperationBase`          | `{ operation, ts, finishedTs?, outcome, message(), timing() }` | Same                                                            | None                          |
| `OperationPending`       | extends `OperationBase`, adds `data?: unknown`                 | Same                                                            | None                          |
| `OperationSuccess`       | extends `OperationBase`, outcome `'success'`                   | Same                                                            | None                          |
| `OperationFailure`       | extends `OperationBase`, adds `error`, `errorSerialized()`     | Same                                                            | None                          |
| `createGenericOperation` | `createGenericOperation(operation, data?)`                     | Same                                                            | None                          |
| `createOperationSuccess` | `createOperationSuccess(pending, message?)`                    | Same                                                            | None                          |
| `createOperationFailure` | `createOperationFailure(pending, error)` with label map        | Same shape, different labels                                    | Label map is project-specific |
| Per-op pending types     | `ClonePending`, `PushPending`, etc.                            | `ParsePending`, `SerializePending`                              | Different names, same shape   |

**Verdict:** The operation model is 95% identical. The only deviation is the per-operation label map in `createOperationFailure` and the per-operation pending type names. **Strong candidate for `@art-lib/cli-operations`.**

### 1.2 Logger

| Aspect          | Art Work (`src/private/logger/createLogger.ts`) | Codec Bin (planned) | Deviation |
| --------------- | ----------------------------------------------- | ------------------- | --------- |
| `LoggerAPI`     | `{ log(op), setOutputMode(mode) }`              | Same                | None      |
| Buffering       | Buffers pending ops until mode is set           | Same                | None      |
| `quiet` mode    | Discards pending buffer, drops future pending   | Same                | None      |
| `verbose` mode  | Flushes buffer, shows all ops                   | Same                | None      |
| Log line format | Delegates to `makeOperationLogLine`             | Same                | None      |

**Verdict:** The logger is 100% identical in behaviour. The only difference would be the log line formatter injected. **Strong candidate for `@art-lib/cli-logger`.**

### 1.3 Operations Log

| Aspect          | Art Work (`src/private/log/createOperationsLog.ts`) | Codec Bin (planned) | Deviation |
| --------------- | --------------------------------------------------- | ------------------- | --------- |
| `OperationsLog` | `{ log(op), all(), since(ts), latest(n) }`          | Same                | None      |
| Storage         | Internal `Operation[]`, excludes pending            | Same                | None      |
| Delegation      | Calls injected `logger(operation)`                  | Same                | None      |

**Verdict:** 100% generic. **Strong candidate for `@art-lib/cli-operations-log`.**

### 1.4 Context Factory Pattern

| Aspect       | Art Work (`src/private/context/createWorkspaceContext.ts`) | Codec Bin (planned `createCodecContext`)     | Deviation                      |
| ------------ | ---------------------------------------------------------- | -------------------------------------------- | ------------------------------ |
| Pattern      | Typed bag: `{ config, store, log, workspace? }`            | Typed bag: `{ config, codec, log, io }`      | Different fields, same pattern |
| Factory      | `createWorkspaceContext(config, store, log, workspace?)`   | `createCodecContext(config, codec, log, io)` | Same arity and shape           |
| Immutability | Returns a plain object                                     | Same                                         | None                           |

**Verdict:** The pattern is identical — a typed context bag composed by a factory. The field names differ because the domain differs (workspace vs codec). **Candidate for a generic `@art-lib/cli-context` factory pattern**, but the concrete types stay project-specific.

### 1.5 Command Action Skeleton

Every Art Work command action repeats the same 7-step skeleton:

```ts
const root = process.cwd();
logger.log(createGenericOperation('boot'));
const config = await loadWorkspaceConfig(root);
const store = createCheckoutStore();
const log = createOperationsLog(logger.log);
const ctx = createWorkspaceContext(config, store, log);
logger.setOutputMode(options.output || config.output.mode);
await run{CommandName}(ctx, options);
```

The codec bin entry points would repeat a similar skeleton:

```ts
const root = process.cwd();
logger.log(createGenericOperation('boot'));
const config = await loadBinConfig(root);
const codec = createArtCodec(config.codec);
const log = createOperationsLog(logger.log);
const ctx = createCodecContext(config, codec, log, io);
logger.setOutputMode(options.output || config.output.mode);
await run{CommandName}(ctx, options);
```

**Verdict:** The skeleton is identical in shape: boot log → load config → create domain objects → create log → create context → set output mode → dispatch. **Candidate for `@art-lib/cli-command-runner`**: a generic runner that accepts a config loader, a context factory, and a command handler.

### 1.6 Test Helpers

| Aspect                   | Art Work (`src/test/helpers/context/`)                   | Codec Bin (planned `src/test/helpers/`) | Deviation                    |
| ------------------------ | -------------------------------------------------------- | --------------------------------------- | ---------------------------- |
| `makeConfigMock`         | Returns a `WorkspaceConfig` with defaults                | Would return `BinConfig` with defaults  | Same pattern, different type |
| `makeCommandContextMock` | Builds `WorkspaceContext` from config mock + store + log | Would build `CodecContext`              | Same pattern, different type |
| `makeTempDir`            | Creates and cleans up temp directories                   | Same                                    | None                         |

**Verdict:** The test helper pattern is identical. **Candidate for `@art-lib/cli-test-helpers`** with generic types.

---

## 2. What Is Different (Project-Specific, Stays Put)

### 2.1 Domain Objects in Context

| Art Work                                   | Codec Bin                                | Why Different                                  |
| ------------------------------------------ | ---------------------------------------- | ---------------------------------------------- |
| `CheckoutStore` — manages cloned repos     | `ArtCodec` — parses/serializes documents | Different domains                              |
| `WorkspaceConfig` — paths, records, output | `BinConfig` — codec overrides, output    | Different config shapes                        |
| `Checkout` — a cloned repository           | No equivalent                            | The codec bin has no checkout concept          |
| `saveCheckoutRecord` — persists state      | No equivalent                            | The codec bin is stateless between invocations |

**Verdict:** These are genuinely project-specific and must stay in their respective projects.

### 2.2 Operation Log Line Presentation

| Aspect  | Art Work (`makeOperationLogLine`)                               | Codec Bin (planned)                         | Deviation                   |
| ------- | --------------------------------------------------------------- | ------------------------------------------- | --------------------------- |
| Columns | `outcome`, `repo`, `checkout`, `operation`, `message`, `timing` | `outcome`, `operation`, `message`, `timing` | Drops `repo` and `checkout` |
| Reason  | Art Work operates on repos/checkouts                            | Codec bin operates on files/content         | Domain difference           |

**Verdict:** The formatter is project-specific because the columns depend on the domain. However, the **pattern** of "format an operation as an array of strings for console output" is generic. **Candidate for `@art-lib/cli-present`**: a presenter interface where each project registers its column format.

### 2.3 Reports

| Aspect         | Art Work                                                                       | Codec Bin                              | Deviation                    |
| -------------- | ------------------------------------------------------------------------------ | -------------------------------------- | ---------------------------- |
| Output style   | Markdown-table reports (Checkout Report, Operations Report, Extraneous Report) | Direct document/content output or JSON | Different presentation needs |
| When presented | After every command that touches checkouts                                     | Immediately after parse/serialize      | Different UX                 |

**Verdict:** Reports are project-specific. The codec bin does not need the Art Work report model.

### 2.4 Config Loading

| Aspect     | Art Work                                             | Codec Bin                               | Deviation                |
| ---------- | ---------------------------------------------------- | --------------------------------------- | ------------------------ |
| Source     | `.art-workspace.mts` bundled with esbuild at runtime | `package.json` + optional CLI overrides | Different config sources |
| Complexity | Complex: paths, records, templates, checkouts        | Simple: output mode, codec overrides    | Different needs          |

**Verdict:** Config loading is project-specific. The **pattern** of "load config → apply CLI overrides → validate" is generic, but the implementation differs too much.

### 2.5 Entry Point Strategy

| Aspect               | Art Work                 | Codec Bin                                        | Deviation                  |
| -------------------- | ------------------------ | ------------------------------------------------ | -------------------------- |
| Binaries             | Single `art-workspace`   | Three: `art-codec`, `art-parse`, `art-serialize` | Different product strategy |
| Entry file           | `src/index.ts` (single)  | `src/bin/{codec,parse,serialize}.ts` (multiple)  | Build config handles both  |
| Command registration | All commands in one file | Commands split across entry points               | Design choice              |

**Verdict:** The entry point strategy is a product decision, not a technical abstraction. Both use the same `esbuild-cli` build.

---

## 3. What Is Missing in Codec Bin (Compared to Art Work)

| Feature                                       | Art Work                                               | Codec Bin                                      | Assessment                                            |
| --------------------------------------------- | ------------------------------------------------------ | ---------------------------------------------- | ----------------------------------------------------- |
| `__BUILD_VERSION__` global                    | Declared in `globals.d.ts`, but never defined by build | Not used; reads version from `package.json`    | Art Work's approach is broken; codec bin's is correct |
| `createOperationsLog.since()` and `.latest()` | Implemented                                            | Planned to implement                           | Both should use the generic log                       |
| `program.version()`                           | Uses `__BUILD_VERSION__`                               | Would use `config.version` from `package.json` | The codec bin approach is more robust                 |
| Error label map                               | Hardcoded per operation in `createOperationFailure`    | Would do the same                              | Could be parameterized                                |
| State persistence                             | `saveCheckoutRecord` per mutation                      | None                                           | The codec bin is stateless by design                  |
| Report presentation                           | Rich markdown tables                                   | Simple stdout/JSON                             | Different needs                                       |

---

## 4. Proposed `@art-lib` Abstraction Units

Based on the comparison, the following units are proposed for extraction into `@art-lib`:

### Unit 1: `@art-lib/cli-operations`

**What:** The operation model, factories, and types.

**Contents:**

- `OperationOutcome`, `OperationBase`, `OperationPending`, `OperationSuccess`, `OperationFailure`
- `createGenericOperation(operation, data?)`
- `createOperationSuccess(pending, message?)`
- `createOperationFailure(pending, error, labelMap?)` — parameterized label map
- Type helpers: `IsOperationPending<T>`, `OperationOf<T>`

**Art Work changes:** Replace hardcoded `errorLabels` with a passed-in map or derive labels from operation names.

**Codec Bin changes:** Import the generic factories; pass `{ parse: 'ParseError', serialize: 'SerializeError' }` as the label map.

### Unit 2: `@art-lib/cli-logger`

**What:** The buffering logger with output modes.

**Contents:**

- `LoggerAPI` interface
- `createLogger(options: { formatter })` — injects the log line formatter
- `quiet` / `verbose` mode logic
- Buffer management (flush on verbose, drop on quiet)

**Art Work changes:** Inject `makeOperationLogLine` as the formatter.

**Codec Bin changes:** Inject a simpler formatter (no repo/checkout columns).

### Unit 3: `@art-lib/cli-operations-log`

**What:** The append-only operations log.

**Contents:**

- `OperationsLog` interface
- `createOperationsLog(logger)`
- `all()`, `since(ts)`, `latest(n)`

**Art Work changes:** Replace local implementation with import.

**Codec Bin changes:** Import directly.

### Unit 4: `@art-lib/cli-command-runner`

**What:** The generic command action skeleton.

**Contents:**

- `createCommandRunner(options: { loadConfig, createContext, logger })`
- Returns an action function that handles the boot log → config → context → mode → dispatch pipeline
- Supports `--output <mode>` and `--version` uniformly

**Usage pattern:**

```ts
const runner = createCommandRunner({
  loadConfig: loadWorkspaceConfig,
  createContext: createWorkspaceContext,
  logger: createLogger({ formatter: makeOperationLogLine }),
});

program.command('clone').action(runner.wrap(runClone));
```

**Art Work changes:** Replace the repeated 7-line skeleton with `runner.wrap()`.

**Codec Bin changes:** Same pattern, different `loadConfig` and `createContext`.

### Unit 5: `@art-lib/cli-test-helpers`

**What:** Generic CLI test utilities.

**Contents:**

- `makeConfigMock<Config>(defaults, overrides?)` — generic config mock
- `makeCommandContextMock<Context>(configMock, ...deps)` — generic context mock
- `makeTempDir()` and `removeTempDirs()`
- `delay(ms)`

**Art Work changes:** Replace typed helpers with generic versions.

**Codec Bin changes:** Import and specialize with `BinConfig` and `CodecContext`.

### Unit 6: `@art-lib/cli-present` (Interface Only)

**What:** A presenter interface for operation log lines and reports.

**Contents:**

- `OperationLogLinePresenter { present(op): string[] }`
- `ReportPresenter { present(ctx): string }`

**Why interface only:** The actual column formats are too project-specific to share as implementations, but the **contract** is identical.

---

## 5. What Should NOT Be Extracted

| Unit                                                   | Reason                                                              |
| ------------------------------------------------------ | ------------------------------------------------------------------- |
| `CheckoutStore` / `createCheckoutStore`                | Domain-specific to Art Work's repo/checkouts model                  |
| `loadWorkspaceConfig` / `.art-workspace.mts` bundling  | Art Work's config format is unique                                  |
| `saveCheckoutRecord`                                   | State persistence is Art Work-specific                              |
| Markdown-table reports (`presentCheckoutReport`, etc.) | Presentation is too domain-specific                                 |
| `createArtCodec` / codec operations                    | Already lives in `@art-md/codec`                                    |
| `buildProgram` with commander                          | Too thin to warrant a library; commander is already the abstraction |
| `buildParseCommand` / `buildSerializeCommand`          | These are the command specs; they belong to the product             |

---

## 6. Summary

| Layer                   | Art Work             | Codec Bin            | Extractable?       | Proposed `@art-lib` Package        |
| ----------------------- | -------------------- | -------------------- | ------------------ | ---------------------------------- |
| Operation model         | Hardcoded            | Planned identical    | **Yes**            | `@art-lib/cli-operations`          |
| Logger                  | Hardcoded            | Planned identical    | **Yes**            | `@art-lib/cli-logger`              |
| Operations log          | Hardcoded            | Planned identical    | **Yes**            | `@art-lib/cli-operations-log`      |
| Command action skeleton | Repeated 12x         | Planned repeated 3x  | **Yes**            | `@art-lib/cli-command-runner`      |
| Test helpers            | Typed copies         | Planned typed copies | **Yes**            | `@art-lib/cli-test-helpers`        |
| Context factory         | Typed bag            | Typed bag            | **Pattern only**   | Generic factory interface          |
| Log line formatter      | 6 columns            | 4 columns            | **Interface only** | `@art-lib/cli-present` (interface) |
| Config loading          | `.art-workspace.mts` | `package.json`       | **No**             | Stay project-specific              |
| Store / state           | `CheckoutStore`      | None                 | **No**             | Stay project-specific              |
| Reports                 | Markdown tables      | Direct output        | **No**             | Stay project-specific              |
| Entry points            | Single binary        | Three binaries       | **No**             | Product decision                   |

**Bottom line:** Approximately 60% of the CLI plumbing is identical and extractable. The biggest win is the command action skeleton (eliminates ~80 lines of repeated boilerplate across 12+ commands in Art Work and 3+ in codec bin) and the operation model (eliminates ~150 lines of duplicated types and factories).
