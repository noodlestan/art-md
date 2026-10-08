# Sub-Agent REPORT (#producer)

**Plan:** `implement-bin-commands`

**Iteration Id:** `implement-parse-command`

**Outcome:** `COMPLETED`

## Evidence

### Changes

| Goal                                                                        | Change                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------- |
| Implement the `parse` operation from the `do` layer down to `codec.parse()` | Added `private/commands/doParse.ts` — `doParse(ctx, options): Promise<ParseOutcome>`. It creates the pending operation with `createParseOperation({ uri })` (the uri is `options.file`, or the `stdin` constant when absent), logs it, reads the source with `ctx.io.readInput(options.file)`, calls `ctx.codec.parse(content)`, logs `createOperationSuccess(pending)`, presents the document with `presentDocument(result.document, options)`, and writes it with `ctx.io.writeOutput(presented, options.write)`. Any throw — read, parse, present, or write — is caught, logged with `createOperationFailure(pending, error)`, and answered with `null`. The operation types are exported as `ParseOptions { file?, json?, write? }` and `ParseOutcome` (`ParseResult | null`). |
| Add the `run{CommandName}` layer over the operation                         | Added `commands/parse/runParse.ts` — `runParse(ctx, options)` logs the generic `command` operation with `createGenericOperation('command', ['parse', options])`, then dispatches to `doParse(ctx, options)` and returns its outcome. It returns the outcome rather than Art Work's `ctx`, because this CLI has no store to hydrate and the entry points need the result to choose an exit code.                                                                                                                                                                                                                                                                                                                                                                          |
| Give the parse tests a small Art MD source                                  | Added `test/helpers/makeParseFixture.ts` — `makeParseFixture()` returns `'# Title\n\nSome prose.'`, which the real codec parses into `Document → SectionBlock: Title → NaturalBlock → NaturalExpression`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| Lock the operation and the runner with unit tests                           | Added `private/commands/doParse.test.ts` (8 tests) and `commands/parse/runParse.test.ts` (4 tests): the success returns a `ParseResult` and logs a `parse` success carrying the uri; the document outline, the `--write` target, and the `--json` form are what reach `writeOutput`; an absent file reads stdin and reports the `stdin` uri; an unreadable source logs a `parse` failure and returns `null` without writing; a rejected write logs the success then the failure and returns `null`; the runner logs the generic `command` operation with `['parse', options]`, forwards to `doParse`, and returns `null` on failure. The io helpers are replaced with typed `vi.fn` mocks, so neither `fs` nor `stdout` is touched.                                      |

#### Files changed

- `$PROJECT/cli/bin/src/private/commands/doParse.ts` — New: the `do{OperationName}` layer — `ParseOptions`, `ParseOutcome`, and `doParse(ctx, options)`.
- `$PROJECT/cli/bin/src/private/commands/doParse.test.ts` — New: 8 tests over the success, the presentation branches, the stdin uri, the read failure, and the write failure.
- `$PROJECT/cli/bin/src/commands/parse/runParse.ts` — New: the `run{CommandName}` layer — the generic `command` log line and the `doParse` dispatch.
- `$PROJECT/cli/bin/src/commands/parse/runParse.test.ts` — New: 4 tests over the generic command operation, the dispatch, and the `null` answer.
- `$PROJECT/cli/bin/src/test/helpers/makeParseFixture.ts` — New: `makeParseFixture()`, the small Art MD source both test files parse.

### Commits

| Id                        | Repository / Checkout / Branch   | Policy   | Hash      | Status      |
| ------------------------- | -------------------------------- | -------- | --------- | ----------- |
| `implement-parse-command` | Art MD / `$PROJECT` / `building` | `NOPUSH` | `ff7b02a` | `COMMITTED` |

**Message:** `build(bin): implement doParse operation and runParse`

**Push:** Not pushed, per the `NOPUSH` policy. No `git push` was run; `git log origin/building..HEAD` shows the commit local to the `building` branch only.

The lefthook `pre-commit` hook (`0-clean`, `1-extract`, `2-ci`) ran on the commit and passed without `--no-verify`.

### Validation

| Command                | Working directory            | Outcome                                                                                                                                                                                                                         |
| ---------------------- | ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm ci`               | `$WORKSPACE`                 | PASS — workspace dependencies installed.                                                                                                                                                                                        |
| `npm ci`               | `$PROJECT` (repository root) | PASS — dependencies reinstalled from `package-lock.json`.                                                                                                                                                                       |
| `npm run test`         | `$PROJECT/cli/bin`           | PASS — exit 0; 12 test files, 69 tests passed (12 new: 8 in `doParse.test.ts`, 4 in `runParse.test.ts`; 57 before).                                                                                                             |
| `npm run test:ci`      | `$PROJECT/cli/bin`           | PASS — exit 0; 69 tests passed; statements 98.7% (153/155), lines 98.69% (151/153), functions 100% (55/55), branches 88.88% (64/72) — over the 90/90/90/75 thresholds. Both new modules and the new fixture helper are at 100%. |
| `npm run lint:fix`     | `$PROJECT/cli/bin`           | PASS — prettier formatted the five new files; eslint `--fix` clean.                                                                                                                                                             |
| `npm run lint`         | `$PROJECT/cli/bin`           | PASS — prettier check clean, eslint clean, `tsc --noEmit` clean.                                                                                                                                                                |
| `npm run ci`           | `$PROJECT` (repository root) | PASS — exit 0; 7/7 turbo tasks successful; the bin package lints, builds (esm + cjs), and clears the coverage thresholds.                                                                                                       |
| `npm run ci` (hook)    | `$PROJECT` (repository root) | PASS — ran again by the pre-commit hook on `ff7b02a`; 7/7 tasks.                                                                                                                                                                |
| `git log --oneline -1` | `$PROJECT`                   | PASS — `ff7b02a build(bin): implement doParse operation and runParse`, the exact prescribed message.                                                                                                                            |
| `git status --short`   | `$PROJECT`                   | Clean after the commit — 5 files committed, nothing uncommitted.                                                                                                                                                                |

Three type errors surfaced during verification and were fixed rather than worked around: `Operation` is a union, so `errorSerialized()` is unreachable without narrowing (the failure test asserts `outcome` and `message()`; the `ParseError` label stays covered in `operations.test.ts`); `ReturnType<typeof vi.spyOn>` erased the spy's argument type and left `call`/`operation` implicitly `any` (the spy is typed `Mock<(operation: Operation) => void>`); and the test files imported `private/context/createCodecContext` one level too deep.

The fixture was chosen from evidence, not guesswork: a throwaway probe test parsed the candidate source and printed the construct outline, which is what `doParse.test.ts` now asserts. The probe file was deleted before the commit and is not in it.

## Blockers (if any)

None.

## Feedback

### For the planner

- **Step 1 gives no `options` shape.** `doParse(ctx, options)` is prescribed without one; the implementation took `ParseOptions { file?, json?, write? }` from the plan's `buildParseCommand` bullet (`[file]` argument, `--json`, `-w, --write`) and deliberately left `-o, --output <mode>` out, because that one is the logger's, applied by the entry point. The serialize instruction should say the same, or the plan should name a shared option shape so the two commands cannot drift.
- **The signature is a named type, not an inline union.** Step 1 and the plan Scope both write `Promise<ParseResult | null>`, but the repository's TypeScript conventions forbid unions in function signatures, so `doParse` returns `Promise<ParseOutcome>` where `ParseOutcome` is the exported alias. Same type, different spelling — worth either fixing the plan's wording or granting the exception once.
- **`runParse`'s return value is unspecified.** Art Work's `runClone` returns `ctx` because it hydrates a checkout store; this CLI has no store, so `runParse` returns `doParse`'s outcome so the entry points can pick an exit code. Nothing in the instruction says which is intended, and the builders iteration will consume it.
- **The operation's `uri` never reaches the parser.** The pending operation carries `options.file ?? 'stdin'`, but the call is the one-argument `ctx.codec.parse(content)`, so `ParseResult.context.uri` is the parser's own default rather than the source identity. If the operation's uri is meant to reach the constructs (the codec's two-argument overload exists for exactly that), Step 1 should say to pass `createParseContext({ uri })`. Separately, the `-` stdin marker is logged as `-`, not as `stdin`, because only an absent path is remapped.
- **One invocation can log two resolved operations.** Step 1's order — log the success, then present — combined with the write inside the `try` means a failed write leaves a `success` and then a `failure` in the log. That reads well for a progress log (the parse did succeed), but it is not "one resolved operation per invocation". Logging the success after `writeOutput` would give one, and would contradict Step 1's stated order. Worth an explicit decision before `doSerialize` copies the shape.

### For the technical writers

- **"Call `ctx.codec.parse(...)`" hides the read.** The `(...)` does not say where the markdown comes from; the implementation reads it with `ctx.io.readInput(options.file)`, inferred from the plan's I/O scope and from `doParse` having no other source. One clause in Step 1 would remove the inference.
- **"Present the document" does not say where the presentation goes.** `presentDocument` returns a string and `doParse` routes it through `ctx.io.writeOutput(presented, options.write)` — that is what makes `--write` work. The previous iteration already flagged that `present*` returns a string; stating the `writeOutput` routing in Step 1 as well would be better still.
- **`createParseOperation` takes an inline object type.** `doParse` therefore passes a single-field literal `{ uri }`. Extracting a named `ParseOperationData` would match the conventions' Types Location rule, but the type is pre-existing and out of this iteration's scope.
- **`cli/bin/_guide.md` is still stale.** Its Package Layout paragraph lists no `commands/`, `private/commands/`, `private/present/`, or `private/context/` — the third iteration in a row to fill one of those directories. This iteration added `src/commands/parse/` and `src/private/commands/`.
- **Nothing else blocked execution.** Every mandatory-reading file resolved, including the six `:READ`-linked convention pages and the three `$ART_WORK` references, and no instruction contradicted the plan.

### For the crew

- **`ctx.io` is a plain mutable object**, so both test files swap `readInput`/`writeOutput` for `vi.fn<CodecIo['readInput']>()` mocks typed off the `CodecIo` contract — no temp files, no `process.stdout` spy. The six-line `mockIo` helper is duplicated in `doParse.test.ts` and `runParse.test.ts`; a shared `src/test/helpers/makeIoMock.ts` would remove the copy, and the serialize iteration will want a third.
- **Asserting the generic command operation needs a logger spy**, because `OperationsLog` retains only resolved operations and the `command` line is pending. `runParse.test.ts` builds its context with `createCodecContext(makeCodecContextMock().config, logger)` and a `vi.spyOn(logger, 'log')`, mirroring `createCodecContext.test.ts`. Letting `makeCodecContextMock` accept a logger would make that shorter.
- **Test names follow the bin package's `GIVEN …, …` / `WHEN …, …` style**, not Art Work's imperative phrasing. Twelve new tests; 69 in the package, all green, coverage 98.7 / 88.88 / 100 / 98.69.
- **The build output is untracked**, so the emitted `dist/` bundles are not part of commit `ff7b02a`; the builders iteration still needs `npm run build` before any integration test spawns them.
