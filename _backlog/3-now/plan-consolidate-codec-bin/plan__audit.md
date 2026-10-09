# Plan Attachment: Audit — CLI Conventions

**Plan:** `consolidate-codec-bin`

**Attachment:** `plan__audit.md`

**Iteration:** `audit-cli-conventions`

**Scope:** `$PROJECT/cli/bin/src/` — 79 TypeScript files (59 production, 20 unit tests). Every file in scope was read in full.

**Purpose:** Record the deviations of the implemented CLI from the TypeScript and Unit Test conventions so Iteration: Apply CLI Conventions can refactor them.

## Convention Sources

| Source                                                                  | Files read                                                                                                                                                |
| ----------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `$PROJECT/node_modules/@noodlestan/conventions-typescript/art/index.md` | index plus all expanded modules: `filesystem`, `strict-code`, `explicit-code`, `types`, `flat-code`, `literals`, `control-flow`                           |
| `$PROJECT/node_modules/@noodlestan/conventions-unit-tests/art/index.md` | Unit-test conventions split by category, including conventions to relax base TypeScript conventions where test code would otherwise fight its own idioms. |

Discovered through the `## Conventions` section of `$PROJECT/_guide.md` (both `::READ` directives). `$PROJECT/cli/bin/_guide.md` declares no additional conventions.

**Method:** Routine: Audit Convention Module Adoption — each convention rule was scanned against every file in scope; zero-count rules were confirmed with forbidden-construct greps (`any`, `interface`, non-null `!`, nested ternaries, blockless `if`, `switch`, single-character names, dynamic imports). In the tables below, `file / line` paths are relative to `$PROJECT/cli/bin/src/`.

## Summary

| Convention group           | Rules with violations | Rules clean | Rules n/a       | Approx. sites |
| -------------------------- | --------------------- | ----------- | --------------- | ------------- |
| TypeScript / Filesystem    | 3 of 6                | 2           | 1 (no barrels)  | ~22           |
| TypeScript / Strict Code   | 0 of 2                | 2           | —               | 0             |
| TypeScript / Explicit Code | 6 of 7                | 1           | —               | ~64           |
| TypeScript / Types         | 2 of 3                | 1           | —               | 2             |
| TypeScript / Flat Code     | 4 of 8                | 4           | —               | ~84           |
| TypeScript / Literals      | 2 of 2                | 0           | —               | ~13           |
| TypeScript / Control Flow  | 0 of 3                | 2           | 1 (no `switch`) | 0             |
| Unit Test conventions      | 8 of 9                | 1           | —               | ~30           |

**Clean by construction (zero violations):** no `any`; no non-null assertions; no `interface` declarations; no nested ternaries; no blockless `if`/`else`; no single-character names; no inline parameter destructuring; no multi-line conditionals; no dynamic imports in `vi.mock`; no deep or external `private/` imports; no barrel-import issues (no barrels exist); `vi.mock` blocks use static references throughout.

---

## Adoption Report — TypeScript Conventions

### Conventions: Typescript / Filesystem

| Convention       | file / line                                                                             | issue                                                                                                                            |
| ---------------- | --------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| File as Function | `private/io/private/writeOutput.ts:8`                                                   | private helper `terminate` shares the file with `writeOutput`; inline the one line in the `writeOutput` function.                |
| File as Function | `private/operations/createGenericOperation.ts:3`                                        | private helper `formatData` not extracted.                                                                                       |
| File as Function | `private/operations/createOperationFailure.ts:10`, `:18`, `:31`                         | three private helpers (`formatRawError`, `extractReason`, `getFailureLabel`) in one file.                                        |
| File as Function | `private/logger/createLogger.ts:7`, `:17`                                               | private helpers `shouldWrite`, `flush` not extracted; both close over `mode`/`buffer` — extraction needs state parameterisation. |
| File as Function | `private/io/private/writeOutput.test.ts:16`, `private/io/private/writeStdout.test.ts:7` | test-local helper `spyOnStdoutWrite` defined twice instead of living in `test/helpers/io`.                                       |

### Conventions: Typescript / Strict Code

Zero violations. No `any` (only vitest's `expect.any(...)` matcher appears) and no `!` non-null assertions anywhere in scope.

### Conventions: Typescript / Explicit Code

| Convention            | file / line                                                                                                                                                                                                                        | issue                                                                                                                          |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Verb Function Names   | `private/operations/types.ts:8`, `:9`, `:25`, `:48` (implementations: `createParseOperation.ts:11`, `createSerializeOperation.ts:11`, `createGenericOperation.ts:13`, `createOperationFailure.ts:48`, `createOperationsLog.ts:23`) | function-valued members named with nouns: `message`, `timing`, `errorSerialized`, `all`.                                       |
| Functions over Arrows | `private/bin/commands/parse/createParseCommand.ts:13`                                                                                                                                                                              | `const action = async (...) => {}` assigned as an arrow, then cast back to `CommandHandler`; use a named function declaration. |
| Functions over Arrows | `private/bin/commands/serialize/createSerializeCommand.ts:13`                                                                                                                                                                      | same pattern as the parse command.                                                                                             |
| Functions over Arrows | `private/logger/createConsoleWriter.ts:6`                                                                                                                                                                                          | arrow function returned where a function expression/declaration is possible; no borderline allowance — see Decisions.          |
| Boolean Naming        | `private/presentation/makeOperationLogLine.ts:13`                                                                                                                                                                                  | boolean variable `hasFinished` uses a prefix; variables must not.                                                              |
| Boolean Naming        | `private/logger/validateVerbosity.ts:3`                                                                                                                                                                                            | boolean type-guard function does not start with `is`/`has`/`should`/`can`; rename per Decisions.                               |
| Plural Arrays         | `private/logger/createLogger.ts:5`                                                                                                                                                                                                 | array `buffer: LogMessage[]` is singular. Rename to `bufferedMessages`.                                                        |
| Plural Arrays         | `private/bin/programs/codec/buildCodecProgram.test.ts:25`                                                                                                                                                                          | array `declared` is singular.                                                                                                  |

### Conventions: Typescript / Types

| Convention                | file / line                                           | issue                                                                                                                                              |
| ------------------------- | ----------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| Order Types by Dependency | `private/logger/types.ts:4` vs `:8`                   | `LogMessage` references `LogLevel`, which is declared afterwards.                                                                                  |
| Types Location            | `private/commands/parse/doParse.ts:12`, `:17`         | `ParseOptions`, `ParseOutcome` exported but not used anywhere else; drop the `export` so they become file-local types (convention stands).         |
| Types Location            | `private/commands/serialize/doSerialize.ts:11`, `:16` | `SerializeOptions`, `SerializeOutcome` exported but not used anywhere else; drop the `export` so they become file-local types (convention stands). |

### Conventions: Typescript / Flat Code

| Convention                                 | file / line                                                                                                                                                                                                               | issue                                                                                                                                                                     |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| No Multi-Line Nested Declarations          | production: `private/bin/commands/parse/createParseCommand.ts:20`, `private/bin/commands/serialize/createSerializeCommand.ts:20`, `private/commands/parse/doParse.ts:21`, `private/commands/serialize/doSerialize.ts:23`; | object/array literals and nested functions passed directly as call arguments must be extracted, even single-line; single-line nested calls are allowed. Tests are exempt. |
| No Complex Expressions in Ternaries        | `private/bin/commands/parse/createParseCommand.ts:16`, `private/bin/commands/serialize/createSerializeCommand.ts:16`                                                                                                      | `validateVerbosity(...)` call sits directly in the ternary condition.                                                                                                     |
| No Complex Expressions in Ternaries        | `private/io/private/writeOutput.ts:9`                                                                                                                                                                                     | `content.endsWith(...)` call sits directly in the ternary condition.                                                                                                      |
| No Function Calls in Literals              | `private/commands/parse/private/createParseOperation.ts:5`, `createSerializeOperation.ts:5`, `private/operations/createOperationSuccess.ts:10`, `createOperationFailure.ts:45`,                                           | `new Date()` constructor expressions inside object literals — `new` counts as a function call.                                                                            |
| No Chained Array Methods on Multiple Lines | `private/operations/createOperationFailure.ts:11-14`                                                                                                                                                                      | `.split('\n').map(...).filter(...)` chain split across four lines; extract intermediate results.                                                                          |

### Conventions: Typescript / Literals

| Convention                      | file / line                                                                                                          | issue                                                                                                                  |
| ------------------------------- | -------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Expand Multi-Level Literals     | `test/helpers/serialize/makeSerializeResultFixture.ts:4`                                                             | returned literal `{ content, context: { uri } }` has two levels on one line.                                           |
| Expand Multi-Level Literals     | `private/bin/commands/parse/createParseCommand.ts:20`, `private/bin/commands/serialize/createSerializeCommand.ts:20` | array literal `['parse', { file, write: options.write }]` mixes two levels on one line.                                |
| Expand Multi-Level Literals     | `private/logger/createLogger.test.ts:26`, `:27`, `:60`, `:72`, `:73`                                                 | literals `{ level: ..., args: [...] }` mix object and array levels on one line.                                        |
| Expand Multi-Level Literals     | `private/config/loadBinConfig.test.ts:23`, `:30`, `private/context/createCommandContext.test.ts:29`, `:39`           | multi-level literals passed inline in calls; `:39` nests three levels (`{ codec: { parserConfig: { constructs } } }`). |
| Expand Returned Object Literals | `test/helpers/codec/createCommandContextMock.ts:14`                                                                  | `return { config, codec, operations, io };` — four logical fields on one line.                                         |
| Expand Returned Object Literals | `test/helpers/codec/makeCodecMock.ts:8`                                                                              | `return { parse, serialize } as unknown as ArtCodec;` — two logical fields on one line.                                |
| Expand Returned Object Literals | `test/helpers/serialize/makeSerializeResultFixture.ts:4`                                                             | `return { content, context: { uri } };` — two logical fields on one line.                                              |

### Conventions: Typescript / Control Flow

Zero violations. All `if`/`else` statements open blocks; functions prefer early returns; no `switch` statements exist (default-case rule n/a).

---

## Adoption Report — Unit Test Conventions

| Convention                | file / line                                                                       | issue                                                                                                                                                                                                                                                                     |
| ------------------------- | --------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Function Mock Naming      | `private/logger/createLogger.test.ts:8`, `:18`, `:31`, `:41`, `:52`, `:64`, `:77` | local function mock named `write` instead of `writeSpy`.                                                                                                                                                                                                                  |
| Context Mock Naming       | `test/helpers/codec/createCommandContextMock.ts:8`                                | miscategorized, should be in `test/helpers/context/`                                                                                                                                                                                                                      |
| Test Description Prefixes | `private/presentation/presentDocument.test.ts:12`                                 | `it('returns the indented JSON document', ...)` starts with a verb; must start with `WHEN`, `FOR`, or `GIVEN` in all caps. All other 19 test files comply.                                                                                                                |
| Helper Grouping           | `test/helpers/makeTempDir.ts:7`                                                   | helper sits at the helpers root instead of a domain directory ( → `test/helpers/tempDirs`). Also `$ART_WORK/cli/work/src/test/helpers/tempDirs/removeTempDirs.ts` (in `checkouts/art-work-building`) is missing and should be used in every test that uses `makeTempDir`. |
| Block Spacing             | `private/io/private/writeOutput.test.ts:48-49`, `:67-68`                          | result capture (`const written = await readFile(...)`) runs directly into the assertion without the required empty line separating blocks.                                                                                                                                |
| Helper Header Comments    | all 12 files under `test/fixtures/` and `test/helpers/`                           | no helper declares a `/** @mocks ... */` or `/** @provides ... */` header; applies to the 4 mock factories, 6 fixture factories, and 2 utility helpers.                                                                                                                   |

---

## Decisions

Resolved after the audit review with the plan owner; each decision either clears a site or names a convention amendment. No ambiguity remains: items marked _amend_ are folded into the TypeScript conventions republish and the Unit Test conventions rewrite; items marked _code change_ are consumed by Iteration: Apply CLI Conventions.

1. **No Abbreviations** — allowlist `ctx`, `ts`, `op`, `dir`; no code change. _TS: amend No Abbreviations with the allowlist._
2. **Types Location** — types not used outside their file must not be exported; `ParseOptions`/`ParseOutcome`/`SerializeOptions`/`SerializeOutcome` lose the `export` (rows restored above). _Convention stands; code change._
3. **Constants Location** — exported constants live in `constants.ts`; `types.ts` is types only. The 8 existing `constants.ts` files are correct. _TS: amend Constants Location (its summary contradicts the Directory Module Structure layout)._
4. **All Caps Constants** — applies only to exported constants from `constants.ts`. Module-level bindings such as `config`, `program`, `mocks`, `codec` are not constants. _TS: amend._
5. **Verb Function Names** — noun-named function properties are allowed when they are getters or return a semantically obvious data structure (`message`, `timing`, `errorSerialized`, `all` stay). _TS: amend._
6. **Type-guard naming** — rename `validateVerbosity` → `isValidVerbosity`. _Code change._
7. **Entry scripts / side-effect entry points** — `bin/{codec,parse,serialize}.ts` are shebang entry scripts and side-effect scripts; they are exempt from File as Function (not recorded as violations). _TS: amend File as Function with an entry-point exemption._
8. **No Function Calls in Literals** — `new` counts as a function call; production only: the 4 `new Date()` sites extract to a preceding `const`. Test sites (`vi.fn()`, `expect.any`, fixture calls) are covered by the test exemption.
9. **No Multi-Line Nested Declarations** — confirmed. Tests exempt. Production: nested calls that fit on one line are allowed; nested object/array literals and nested functions are **not** allowed even if they fit on one line — extract them into a preceding statement (the 4 sites listed above).
10. **Fixture Factory Naming** — `make{Construct}Fixture` is correct as implemented. _Unit tests: fix convention text (`make{Construct}Mock` → `make{Construct}Fixture`)._
11. **Mock naming** — three kinds: mock factories `create{X}Mock`, inline function mocks `{functionName}Mock`, spies `{functionName}Spy` (`writeSpy` was correct, `write` is the violation; `createCommandContextMock` name is correct). `makeCodecMock` → rename `createCodecMock`. _Unit tests: amend Function/Context Mock Naming + examples._
12. **Grouped mocks** — `const mocks = { fn: vi.fn() }` with `mocks.<fn>` access is allowed. _Unit tests: add example._
13. **Context mock location** — `createCommandContextMock.ts` moves `test/helpers/codec/` → `test/helpers/context/`. _Code change._
14. **Cross-Package Mock Ownership** — the consuming package may mock the interfaces it consumes; the rule is dropped. _Unit tests: remove._
15. **Helper Grouping** — generic `test/helpers/{domain}/` paths (current `constructs/`/`primitives/` wording does not fit this package); `makeTempDir` → `test/helpers/tempDirs/`; port `removeTempDirs` from `$ART_WORK`. _Unit tests: rewrite._
16. **No Nested Type Declarations** — the rule must distinguish _simple_ from _complex_ nested inline types with examples; `{ mode: LogVerbosity }` is simple and may stay inline. _TS: amend with examples._
17. **Functions over Arrows** — no borderline allowance: an arrow assigned to a variable or returned where a function declaration/expression fits is a violation (`createConsoleWriter.ts:6`, the `action` arrows in both command factories). _Code change._
18. **Entry-point duplication** (load-config → build-program → parse repeated in `bin/*.ts`) — tracked by Observation 1; out of convention scope.

## Observations (outside convention scope)

Not convention violations; recorded because they affect the refactoring iteration.

1. The `parse` and `serialize` paths are parallel duplicates (command factories, `do*` bodies, option wiring) — already tracked by the plan's duplication scope.
2. No unit tests exist for `bin/commands/{parse,serialize}/create*Command.ts`, `bin/options/*`, `logger/createConsoleWriter.ts`, `logger/validateVerbosity.ts`, or the entry scripts; refactoring them has no suite guard.
3. Type-assertion escapes hide mismatches: `return action as CommandHandler` (`createParseCommand.ts:29`, `createSerializeCommand.ts:29`), `as unknown as ArtCodec` (`makeCodecMock.ts:8`), `as unknown as typeof process.stdout.write` (`writeOutput.test.ts:24`, `writeStdout.test.ts:15`), `JSON.parse(source) as ArtDocument` (`doSerialize.ts:28`).
4. Import style is inconsistent: `import { type LoggerAPI }` (`createCommandContext.ts:4`) vs `import type` elsewhere; `createOperationsLogMock.ts:3` imports types from `createOperationsLog.ts` instead of `operations/types.ts`.

## Verification

- `npm ci` — passed (repository root).
- `npm run lint:fix` / `npm run lint` — passed after formatting this attachment.
- `npm run ci` — executed by the pre-commit hook for commit `audit-cli-conventions`.
